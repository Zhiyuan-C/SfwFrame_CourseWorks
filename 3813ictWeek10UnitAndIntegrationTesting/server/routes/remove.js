module.exports = (app, db, collection, ObjectID) => {
  app.post('/deleteItem', (req, res) => {
    id = req.body.objId;
    objId = new ObjectID(id);
    collection.find({_id: objId}).count((err, count) => {
      if(count < 1){
        res.send({'ok': false});
      } else {
        collection.deleteOne({_id: objId}, (err, docs)=>{
          collection.find({}).toArray((err, data) => {
            res.send(data);
          });
        });
      }

    });

  });
}