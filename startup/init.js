const express = require('express');
const cors = require('cors');
const routes = require('../routes');
const cookieParser = require('cookie-parser');

module.exports = function (app) {
  app.use(express.json());
  // https://github.com/expressjs/cors
  // Enable All CORS Request
  app.use(cors());
  // Cookie Parser 등록
  app.use(cookieParser());
  /* routes 등록 */
  app.use('/api', routes);
};