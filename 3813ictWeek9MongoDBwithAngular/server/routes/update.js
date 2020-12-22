module.exports = (app, db, collection, ObjectID) => {
  app.post('/updateItem', (req, res) => {
    product = req.body[1];
    var objId = new ObjectID(req.body[0]);
    collection.updateOne({_id: objId}, {$set: {name: product.name, description: product.description, price: product.price, units: product.units}}, () => {
      res.send({'ok': true});
    })
    
  });
}