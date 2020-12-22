// var express = require('express');
// var path = require('path');
// var app = express();
// let file = path.join(__dirname, "../www/index.html");
// app.get('/',function(req, res){
//     res.sendFile(file);
// });
// module.exports = app;

module.exports = function(app,path){
    app.get('/',function(req,res){
        let filepath = path.resolve('./www/index.html');
        res.sendFile(filepath);
    });
}