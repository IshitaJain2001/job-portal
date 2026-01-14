// Applications Routes
const express = require('express');
const router = express.Router();
const Application = require('../../backend/models/Application');
const Job = require('../../backend/models/Job');
const auth = require('../../backend/middleware/auth');

// Apply to a job
router.post('/:jobId', auth, async (req, res) => {
  try {
    const { coverLetter, resume } = req.body;

    // Check if already applied
    let application = await Application.findOne({
      userId: req.userId,
      jobId: req.params.jobId,
    });

    if (application) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    application = new Application({
      userId: req.userId,
      jobId: req.params.jobId,
      coverLetter,
      resume,
    });

    await application.save();

    // Add user to job applicants
    await Job.findByIdAndUpdate(
      req.params.jobId,
      { $addToSet: { applicants: req.userId } },
      { new: true }
    );

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get applications for current user's jobs (employer)
router.get('/my-applications', auth, async (req, res) => {
  try {
    // Get all jobs posted by current user
    const jobs = await Job.find({ postedBy: req.userId });
    const jobIds = jobs.map(job => job._id);

    // Get applications for these jobs
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('userId', 'name email phone')
      .populate('jobId', 'title')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's applications (job seeker)
router.get('/user-applications', auth, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.userId })
      .populate({
        path: 'jobId',
        populate: { path: 'postedBy', select: 'name companyName' },
      })
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update application status (employer only)
router.put('/:applicationId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user owns the job
    const job = await Job.findById(application.jobId);
    if (job.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
