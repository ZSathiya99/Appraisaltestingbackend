require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const teachingRoutes = require('./routes/teachingRoutes');
const path = require('path');
const cors = require('cors');

const app = express();

connectDB();

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api', teachingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));