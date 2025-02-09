const express = require('express');
const sequelize = require('./config/database');
const apiRoutes = require('./routes/api');
const Story = require('./models/story');

const app = express();
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// Sync database and create tables if not exists
sequelize.sync().then(() => {
  console.log('Database synced.');
});

module.exports = app;
