var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var http = require('http').Server(app);

require('./routes/indexroute.js')(app, path);
require('./routes/accountroute.js')(app, path);

app.use(bodyParser.json());
app.use(express.static(__dirname + "/www"));

let server = http.listen(3000, function(){
    let host = server.address().address;
    let port = server.address().port;
    console.log("My First Nodejs Server");
    console.log("Server listening on: "+host+" port: "+port);
});

let dummyUser = [
    {email: "123@456.com", password: "222", userName:"Jone"},
    {email: "ddd@abc.com", password: "111", userName:"Mia"},
    {email: "111@222.com", password: "333", userName:"Leo"},
];
app.post('/api/login',function(req, res){
    if(!req.body){
        return res.sendStatus(400);
    }
    
    var user = {};
    user.email = req.body.userEmail;
    user.password = req.body.userPassword;
    for (i in dummyUser){
        if(req.body.userEmail == dummyUser[i].email && req.body.userPassword == dummyUser[i].password){
            user.ok = true;
            user.userName = dummyUser[i].userName;
            console.log(dummyUser[i].userName);
            break;
        } else {
            user.ok = false;
            console.log(dummyUser[i].userName);
            user.errors = {};
        }
    }
    res.send(user);

});