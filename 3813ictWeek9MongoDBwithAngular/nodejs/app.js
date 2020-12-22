const MongoClient = require('mongodb').MongoClient,
      mongoUrl = 'mongodb://localhost:27017',
      dbName = 'mydb';
var ObjectID = require('mongodb').ObjectID;

const docArray = [
  {id: 10, name: "coffee", description: "drink", price: 5, units: 10},
  {id: 11, name: "tea", description: "drink", price: 4, units: 2},
  {id: 12, name: "water", description: "drink", price: 2, units: 20}
];
const queryJSONf = {},
      queryJSONup = { name: "coffee"},
      updateJSON = { name: "milk" },
      queryJSONdel = { name: "water"};

MongoClient.connect(mongoUrl, {poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    if (err) {
      return console.log(err);
    }
    console.log('Connected successfully to database server');
  
    const db = client.db(dbName),
          collection = db.collection('product');
    // collection.remove({});
    funcOrders(client, collection);
    // require('./read.js')(db, collection);
});  

async function funcOrders(client, collection){
  await collection.deleteMany({});
  await require('./add.js')(collection, docArray);
  await require('./read.js')(collection);
  await require('./update')(collection, queryJSONup, updateJSON);
  await require('./remove')(collection, queryJSONdel);
  await require('./read.js')(collection);
  client.close();
}