module.exports = (collection) => {
    collection.find({}).toArray((err, data) => {
        if (err) {
            return console.log(err);
        }
    });
  }