const Result = require('./model/result.js'); // Result class, create Result object
/**
 * Routes that not only work with database but also work with socket and formidable
 *
 * @param {Express} app
 * @param {MongoClient} MongoClient
 * @param {string} mongoUrl
 * @param {string} dbName
 * @param {*} io
 * @param {Formidable} formidable
 * @param {Path} filePath
 */
module.exports = (app, MongoClient, mongoUrl, dbName, io, formidable, filePath) => {
  const result = new Result(false, '');
  MongoClient.connect(mongoUrl, {poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    // print the error if connection fail
    if (err) { return console.log(err); }
    const db = client.db(dbName);
    // socket
    require('./routes/chat.js')(io, db);
    
  });
  // file upload
  require('./routes/upload/userAvatar.js')(app, formidable, filePath, result);
  require('./routes/upload/chatImage.js')(app, formidable, filePath, result);
  
  
}