const express = require('express');
const auth = require('../routes/auth');
const blogs = require('../routes/blogs');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/blogs', blogs);
  app.use('/api/auth', auth);
  app.use(error);
}