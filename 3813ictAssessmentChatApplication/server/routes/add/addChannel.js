const Channel = require('../../model/channel.js'); // Channel class, create Channel object

/**
 * Add new channel to database
 *
 * @param {Express} app
 * @param {*} db
 * @param {string} colName
 * @param {Result} result
 */
module.exports = (app, db, colName, result) => {
  app.post('/addChannel', async (req, res) =>{
    // initialise variables
    let channel = new Channel(req.body[0].channelName, req.body[0].groupBelong);
    const newGroupChannelList = req.body[1];
    const channelCollection = db.collection(colName);
    const groupCollection = db.collection('Group');

    // check if channel already exist in the group
    const groupData = await groupCollection.find({groupName: channel.groupBelong}).toArray();
    const channelList = groupData[0].groupChannel;
    const i = channelList.findIndex(item => ((item == channel.channelName)));
    if (i != -1){
      result.msg = 'channel already exist';
      res.send(result);
      return;
    }

    // insert new channel into database
    await channelCollection.insertOne(channel);

    // update group data in Group collection
    await groupCollection.updateOne({groupName: channel.groupBelong}, {$set: {groupChannel: newGroupChannelList}});
    result.setResult(true, 'create new channel success');
    res.send(result);
    result.resetResult();
  });
  

}