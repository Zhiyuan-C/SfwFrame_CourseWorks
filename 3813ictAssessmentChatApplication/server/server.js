// Back-end Server
const express = require('express'), // express module for http request
      app = express(), // Express
      http = require('http').Server(app), // listen to the server
      cors = require('cors'), // for crost origin request , localhost:4200 request localhost:3000
      bodyParser = require('body-parser');

// Database
const MongoClient = require('mongodb').MongoClient,
      mongoUrl = 'mongodb://localhost:27017',
      ObjectID = require('mongodb').ObjectID,
      dbName = 'chat';

// Socket io
const io = require('socket.io')(http);

// File upload
const filePath = require('path'),
      formidable = require('formidable');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../dist/chatApplication3813ictAssessment'));

// display iamge for user avatar
app.use(express.static(__dirname + '/image/avatar/'));
app.get('/userAvatar', (req, res) => {
  let imagePath = __dirname + '/image/avatar/' + req.query.fileName;
  res.sendFile(imagePath);
});

// display image for chat
app.use(express.static(__dirname + '/image/message/'));
app.get('/chat/message', (req, res) => {
  let imagePath = __dirname + '/image/message/' + req.query.fileName;
  res.sendFile(imagePath);
});

// Initialise admin user into database when new database used
require('./initialData/adminUser.js')(MongoClient, mongoUrl, dbName, (result) => {
  if(result.status){
    console.log('Initialise admin user');
    console.log(result.msg);
  }
});

// Start server
require('./routes/listen.js')(http, (result) => {
  console.log(result.msg);
});

// Routes that mainly use database
require('./dbRoutes.js')(app, MongoClient, mongoUrl, dbName);

// Other routes use socket, formidable, and database
require('./otherRoutes.js')(app, MongoClient, mongoUrl, dbName, io, formidable, filePath);

