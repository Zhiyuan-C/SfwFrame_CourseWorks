module.exports = (app, db, collection) => {
  app.get('/getItem', (req, res) => {
    collection.find({}).toArray((err, data) => {
      if (err) {
        return console.log(err);
      }
      res.send(data);
    });
  });
}