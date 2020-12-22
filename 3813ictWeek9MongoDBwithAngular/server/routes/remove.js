module.exports = (app, db, collection, ObjectID) => {
  app.post('/deleteItem', (req, res) => {
    id = req.body.objId;
    objId = new ObjectID(id);
    collection.deleteOne({_id: objId}, (err, docs)=>{
      collection.find({}).toArray((err, data) => {
        res.send(data);
      });
    });
  });
}