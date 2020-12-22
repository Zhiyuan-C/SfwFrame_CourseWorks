var express = require('express');
var app = express();
var http = require('http').Server(app);
var cors = require('cors');

const io = require('socket.io')(http);
const sockets = require('./sockets.js');
const server = require('./listen.js');
const PORT = 3000;

app.use(cors());
sockets.connect(io, PORT);
server.listen(http, PORT);
