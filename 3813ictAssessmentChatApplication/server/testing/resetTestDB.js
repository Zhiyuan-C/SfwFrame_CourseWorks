const Result = require('../model/result.js');
/**
 * Delete database that has database name provided
 *
 * @param {MongoClient} MongoClient
 * @param {string} mongoUrl
 * @param {string} dbName
 * @param {*} callback
 */
module.exports = (MongoClient, mongoUrl, dbName, callback)=>{
  // connect to database
  MongoClient.connect(mongoUrl, {poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      // print the error if connection fail
      if (err) {
        console.log('first error');
        console.log(err);
        return err;
      }
      // variables for database
      const db = client.db(dbName);
      // drop databse
      db.dropDatabase((err2) => {
        if (err2) {
          console.log('second error');
          console.log(err2);
          return err;
        } else {
          const result = new Result(true, 'drop database success');
          callback(result);
        }
      });
      client.close();
  });
}