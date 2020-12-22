module.exports = (collection, queryJSONup, updateJSON) => {
  collection.updateOne(queryJSONup, {$set: updateJSON}, (err, result) => {
    console.log("for the document with: ");
    console.log(queryJSONup);
    console.log("SET: ");
    console.log(updateJSON);
  })
}