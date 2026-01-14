// Saved Jobs Routes
const express = require('express');
const router = express.Router();
const SavedJob = require('../../backend/models/SavedJob');
const auth = require('../../backend/middleware/auth');

// Get all saved jobs for current user
router.get('/', auth, async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ userId: req.userId })
      .populate({
        path: 'jobId',
        populate: { path: 'postedBy', select: 'name companyName email' },
      })
      .sort({ savedAt: -1 });

    res.json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save a job
router.post('/:jobId', auth, async (req, res) => {
  try {
    // Check if already saved
    let savedJob = await SavedJob.findOne({
      userId: req.userId,
      jobId: req.params.jobId,
    });

    if (savedJob) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    savedJob = new SavedJob({
      userId: req.userId,
      jobId: req.params.jobId,
    });

    await savedJob.save();
    await savedJob.populate({
      path: 'jobId',
      populate: { path: 'postedBy', select: 'name companyName email' },
    });

    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove saved job
router.delete('/:jobId', auth, async (req, res) => {
  try {
    await SavedJob.findOneAndDelete({
      userId: req.userId,
      jobId: req.params.jobId,
    });

    res.json({ message: 'Job removed from saved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
