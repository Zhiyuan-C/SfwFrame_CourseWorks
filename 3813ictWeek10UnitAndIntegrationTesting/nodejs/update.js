module.exports = (collection, queryJSONup, updateJSON) => {
  collection.updateOne(queryJSONup, {$set: updateJSON});
}