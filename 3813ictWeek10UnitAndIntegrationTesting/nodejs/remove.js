module.exports = (collection, queryJSONdel) => {
  collection.deleteOne(queryJSONdel);

}