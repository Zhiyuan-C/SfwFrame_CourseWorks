module.exports = (collection, docArray) => {
  collection.insertMany(docArray, (err, result) => {
    console.log('Following doc inserted into the collection: ');
    console.log(docArray);
  })
}