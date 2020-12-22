const User = require('../model/user.js');
const Result = require('../model/result.js');
// initialise admin user when new database created
module.exports = (MongoClient, mongoUrl, dbName, callback) => {
    // connect to database
    MongoClient.connect(mongoUrl, {poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        // print the error if connection fail
        if (err) {
            return console.log(err);
        }
        // variables for database, collection and user object
        const db = client.db(dbName);
        const collection = db.collection('User');
        const adminUser = new User('admin', 'admin@admin.com', 'admin', '', false, true, true, [], []);
        // check if admin user exist
        collection.find({userName: 'admin'}).count((err, count) => {
            // if admin user does not exist, create one
            if (count < 1) {
                collection.insertOne(adminUser, (err)=>{
                    if (err) {
                        console.log(err);
                    }
                    // create success
                    const result = new Result(true, 'create success');
                    callback(result);
                    client.close();
                });
            } else {
              const result = new Result(false, 'admin user already exists');
              callback(result);
              client.close();
            }
        });
    });
}