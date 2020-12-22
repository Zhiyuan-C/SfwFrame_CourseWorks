module.exports = (collection, queryJSONdel) => {
  collection.deleteOne(queryJSONdel, (err, result)=>{
    console.log("Removed the documents with: ");
    console.log(queryJSONdel);
  });

}