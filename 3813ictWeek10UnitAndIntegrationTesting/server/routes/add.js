module.exports = (app, db, collection) => {
  app.post('/addItem', (req, res) => {
    product = req.body;
    result = {'num': 0, 'error': null, 'errorMsg': null};
    
    collection.find({'id': product.id}).count((err, count) => {
      if (count > 0) {
        result.error = 'id';
        result.errorMsg = 'id already exisit'
        res.send(result);
      } else {
        collection.find({'name': product.name}).count((err, count) => {
          if (count > 0) {
            result.error = 'name';
            result.error = 'product already exisist'
            res.send(result);
          } else {
            collection.insertOne(product, (err, dbres) => {
              let num = dbres.insertedCount;
              result.num = num;
              res.send(result);
            });
          }
        });
      }
    });
  });
}