// Jobs Routes
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const auth = require('../middleware/auth');

// ⭐ IMPORTANT: /my-jobs MUST come BEFORE /:id
// Get current user's posted jobs
router.get('/my-jobs', auth, async (req, res) => {
  try {
    console.log('🔍 /my-jobs route hit. UserId:', req.userId);
    const user = await User.findById(req.userId);
    console.log('👤 User found:', user?.email, user?.userType);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.userType !== 'employer') {
      return res.status(403).json({ message: 'Only employers can view their jobs' });
    }

    const jobs = await Job.find({ postedBy: req.userId })
      .populate('postedBy', 'name companyName email')
      .sort({ createdAt: -1 });

    console.log('📋 Found jobs:', jobs.length);
    res.json(jobs);
  } catch (error) {
    console.error('❌ Error in /my-jobs:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get all jobs (only excluding jobs posted by current user if they're an employer)
router.get('/', async (req, res) => {
  try {
    const { category, location, search } = req.query;
    const userId = req.headers.userid; // Optional - for filtering out own jobs

    let query = { status: 'active' };

    // Exclude jobs posted by current user
    if (userId) {
      query.postedBy = { $ne: userId };
    }

    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'name companyName email')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    console.log('🔍 /:id route hit. Id:', req.params.id);
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name companyName email')
      .populate('applicants', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create job (employer only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is employer
    const user = await User.findById(req.userId);
    if (user.userType !== 'employer') {
      return res.status(403).json({ message: 'Only employers can post jobs' });
    }

    const { title, description, category, location, salary, jobType, skills, experience } =
      req.body;

    const job = new Job({
      title,
      description,
      category,
      location,
      salary,
      jobType,
      skills,
      experience,
      postedBy: req.userId,
      companyName: user.companyName,
    });

    await job.save();
    await job.populate('postedBy', 'name companyName email');

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update job (employer only - their own jobs)
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the one who posted the job
    if (job.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const { title, description, category, location, salary, jobType, skills, experience, status } =
      req.body;

    if (title) job.title = title;
    if (description) job.description = description;
    if (category) job.category = category;
    if (location) job.location = location;
    if (salary) job.salary = salary;
    if (jobType) job.jobType = jobType;
    if (skills) job.skills = skills;
    if (experience) job.experience = experience;
    if (status) job.status = status;

    job.updatedAt = Date.now();
    await job.save();
    await job.populate('postedBy', 'name companyName email');

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete job
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
