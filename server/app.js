const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Use dotnv module to load environment variables from a .env file into process.env 
require('dotenv').config()

// Include routes files
const authRoutes = require('./api/routes/auth');
const channelsRoutes = require('./api/routes/channels');
const messagesRoutes = require('./api/routes/messages');

// Connect database
mongoose.connect(process.env.DATABASE)
.then(() => {
  console.log('Database connected');
})
.catch(err => {
  console.log(err);
});

// Configure body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelsRoutes);
app.use('/api/messages', messagesRoutes);

// Catch 404 error
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Handle other error
app.use((req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;