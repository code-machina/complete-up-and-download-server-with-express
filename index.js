'use strict';

const _ = require('lodash');
let jwt = require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');
require('express-async-errors');

const express = require('express');
const app = express();

require('./startup/init')(app);

process.on('unhandledRejection', (error) => {
  console.log(' WE GOT AN UNHANDLED REJECTION .... ');
  console.log(error);
  // winston.error(error.message, error);
});

process.on('uncaughtException', (ex) => {
  console.log(' WE GOT AN UNCAUGHTED EXCEPTION .... ');
  console.log(ex);
  // console.log(ex);
  // winston.error(ex.message, ex);
  process.exit(1);
});
 
// Start web server at port 3000
let port = process.env.PORT | 4093;
let server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log(`Server start at http://${host}:${port}`);
});