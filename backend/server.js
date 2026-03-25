// Main Server File
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoUri = "mongodb+srv://ishitajain385_db_user:wwgofAZeHqUc2w19@cluster0.jwhe1rf.mongodb.net/"
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/auth', require('./routes/passwordReset')); // Uncomment after npm install nodemailer
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/savedjobs', require('./routes/savedjobs'));
app.use('/api/applications', require('./routes/applications'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
