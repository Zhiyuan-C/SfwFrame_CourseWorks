const DBOperation = require('./model/dbOperation.js');
const Result = require('./model/result.js'); // Result class, create Result object
/**
 * connect to database and require other routes
 *
 * @param {Express} app
 * @param {MongoClient} MongoClient
 * @param {string} mongoUrl
 * @param {string} dbName
 */
module.exports = (app, MongoClient, mongoUrl, dbName) => {
  const colNameUser = 'User',
        colNameGroup = 'Group',
        colNameChannel = 'Channel';
  const DBoperation = new DBOperation(),
        result = new Result(false, '');
  
  MongoClient.connect(mongoUrl, {poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    // print the error if connection fail
    if (err) { return console.log(err); }
    const db = client.db(dbName);
    // login & logout
    require('./routes/login')(app, client, db, colNameUser, result);

    // add new data
    require('./routes/add/addUser.js')(app, db, colNameUser, result);
    require('./routes/add/addGroup.js')(app, db, colNameGroup, DBoperation, result);
    require('./routes/add/addChannel.js')(app, db, colNameChannel, result);

    // edit data
    require('./routes/edit/editGroupUser.js')(app, db, DBoperation, result);
    require('./routes/edit/editGroupUserRole.js')(app, db, DBoperation);
    require('./routes/edit/editChannelUser.js')(app, db, DBoperation);
    require('./routes/edit/editUserAvatar.js')(app, db, colNameUser);
    require('./routes/edit/editRole.js')(app, db, colNameUser, DBoperation);

    // get data
    require('./routes/get/getChannelList.js')(app, db, colNameChannel);
    require('./routes/get/getGroupUserList.js')(app, db);
    require('./routes/get/getChannelUserList.js')(app, db);

    // remove data
    require('./routes/remove/removeGroup.js')(app, db, colNameGroup, DBoperation);
    require('./routes/remove/removeUser.js')(app, db, colNameUser, DBoperation);
    require('./routes/remove/removeChannel.js')(app, db, colNameChannel, result);
  });
  
  // retrieve data
  require('./routes/get/getUserDetail.js')(app, MongoClient, mongoUrl, dbName, colNameUser);
  require('./routes/get/getGroupDetail.js')(app, MongoClient, mongoUrl, dbName, colNameGroup);
  require('./routes/get/getChannelDetail')(app, MongoClient, mongoUrl, dbName, colNameChannel);
  require('./routes/get/getGroupList.js')(app, MongoClient, mongoUrl, dbName, colNameGroup);
  require('./routes/get/getUserList.js')(app, MongoClient, mongoUrl, dbName, colNameUser);
}