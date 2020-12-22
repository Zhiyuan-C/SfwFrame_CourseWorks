// DBoperation that perform async/await loop action on the queries
class DBoperation {
  /**
   * Make foreach async/await
   *
   * @param {any[]} array
   * @param {*} callback
   * @memberof DBoperation
   */
  async forEachData (array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index]);
    }
  }

  /**
   * Update data given by the collection, attributes and new data. Can remove or add data depend on mode
   *
   * @param {any[]} dataList
   * @param {*} collection
   * @param {*} queryFind
   * @param {*} queryUpdate
   * @param {string} newData
   * @param {string} mode
   * @memberof DBoperation
   */
  async updateMany (dataList, collection, queryFind, queryUpdate, newData, mode) {
    // if the list is empty then just add
    await this.forEachData(dataList, async (item) => {
      let newList = [];
      // update query to suit with each name
      for (const key in queryFind) {
        queryFind[key] = item;
      }
      // get data
      const data = await collection.find(queryFind).toArray();

      // update query with proper value
      for (const key in queryUpdate) {
        newList = data[0][key]; //key should be same because operating under same table
        if (mode === 'add') {
          // add to list
          newList.push(newData);
        } else {
          // remove from list
          for (let i = 0; i < newList.length; i++) {
            if (newList[i] === newData) {
              newList.splice(i, 1);
            }
          }
        }
        // update query
        queryUpdate[key] = newList; //sample {grouplist: ['something new']}
      }
      // update database
      await collection.updateOne(queryFind, {$set: queryUpdate});
    });
    
  }
}

module.exports = DBoperation;