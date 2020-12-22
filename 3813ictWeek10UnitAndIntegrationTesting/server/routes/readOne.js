module.exports = (app, db, collection, ObjectID) => {
  app.post('/getOneItem', (req, res) => {
    id = req.body.objId;
    objId = new ObjectID(id);
    collection.find({_id: objId}).count((err, count) => {
      if (count < 1) {
        res.send({'error': 'id', 'errorMsg': 'item does not exist'});
      } else {
        collection.find({_id: objId}).toArray((err, data) => {
          res.send(data);
        });
      }
    });
    
  });
}