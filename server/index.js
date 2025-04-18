const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// Routes
const pollRoutes = require('./routes/polls');
const authRoutes = require('./routes/auth');
const auth = require('./middleware/auth');

// Public routes
app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes); // Public poll routes

// Protected routes (admin only)
app.use('/api/admin/polls', auth, pollRoutes); // Protected poll routes for admin

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process if connection fails
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});