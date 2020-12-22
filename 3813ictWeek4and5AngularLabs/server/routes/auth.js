let dummyUsers = require('./users.js');

module.exports = (app)=>{
    app.get('/api/auth',(req, res)=>{
        res.json(dummyUsers);
    });
    // app.post('/api/auth',(req, res)=>{
    //     if(!req.body){
    //         return res.sendStatus(400);
    //     }
    //     res.json(dummyUsers);
    // });
}

