module.exports = (collection) => {
    collection.find({}).toArray((err, data) => {
        if (err) {
            return console.log(err);
        }
        console.log("Following are the current data");
        console.log(data);
    });
  }