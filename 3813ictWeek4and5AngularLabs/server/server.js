var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors());
app.use(express.static(path.join(__dirname, '../dist/Week4AngularLabs3813ICT/')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

require("./routes/auth.js")(app);

let server = http.listen(3000, ()=>{
    let host = server.address().address;
    let port = server.address().port;
    console.log("Server listening on: "+host+" port: "+port);
});