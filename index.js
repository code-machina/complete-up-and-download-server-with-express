'use strict';
const express = require('express');
const app = express();
const multer = require('multer');
 
let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads/'); // set upload directory on local system.
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now()); // appending current date to the file name.
    }
});
 
let upload = multer({ storage: storage }).single('file'); // file upload handler , should be same same as form element name
 
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html"); // load html form
});

app.post('/api/v1/upload', function (req, res) { // process the input request
    upload(req, res, function (err) { 
        if (err) {
            return res.end("Error uploading photo.");
        }
        res.end("Photo is uploaded successfully.");
    });
});

app.get('/api/v1/download', function (req, res) {
  
})
 
// Start web server at port 3000
let port = 3000;
let server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log(`Server start at http://${host}:${port}`);
});