// var express = require('express');
// var path = require('path');
// var app = express();
// let file = path.join(__dirname, "../www/user.html");
// app.get('/user',function(req, res){
//     res.sendFile(file);
// });
// module.exports = app;

module.exports = function(app,path){
    app.get('/user',function(req,res){
        let filepath = path.resolve('./www/user.html');
        res.sendFile(filepath);
    });
}