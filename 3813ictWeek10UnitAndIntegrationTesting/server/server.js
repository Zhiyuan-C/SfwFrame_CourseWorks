// back-edn server
const express = require('express'),
      app = express(),
      http = require('http').Server(app),
      bodyParser = require('body-parser'),
      cors = require('cors');

// mongodb
const MongoClient = require('mongodb').MongoClient,
      mongoUrl = 'mongodb://localhost:27017',
      dbName = 'mydb';
var ObjectID = require('mongodb').ObjectID;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// connect to the server
MongoClient.connect(mongoUrl, {poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
  if (err) {
    return console.log(err);
  }
  console.log('Connected successfully to database server');

  const db = client.db(dbName),
        collection = db.collection('product');

  require('./routes/read.js')(app, db, collection);
  require('./routes/readOne.js')(app, db, collection, ObjectID);
  require('./routes/add.js')(app, db, collection);
  require('./routes/remove.js')(app, db, collection, ObjectID);
  require('./routes/update.js')(app, db, collection, ObjectID);
  require('./listen.js')(http);
});