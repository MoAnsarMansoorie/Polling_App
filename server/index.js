const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const pollRoutes = require('./routes/pollRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/polls', pollRoutes);
app.use(cors({
    origin: 'http://localhost:5173', // Your Vite frontend URL
    credentials: true
  }));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});