module.exports = (app, db, collection, ObjectID) => {
  app.post('/updateItem', (req, res) => {
    product = req.body;
    var objId = new ObjectID(req.body.objId);
    collection.find({_id: objId}).count((err, count) => {
      if (count < 1) {
        res.send({'ok': false});
      } else {
        collection.updateOne({_id: objId}, {$set: {name: product.name, description: product.description, price: product.price, units: product.units}}, () => {
          res.send({'ok': true});
        });
      }
    });
    
    
  });
}