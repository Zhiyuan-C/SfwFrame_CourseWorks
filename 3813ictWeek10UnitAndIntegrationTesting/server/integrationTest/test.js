const assert = require('assert'),
      url = 'http://localhost:3000',
      chai = require('chai'),
      chaiHttp = require('chai-http'),
      should = chai.should();

const fakeObjId = '5d00cf000d000b0e0000dbdf';
let id = '';

require('../../nodejs/app.js');
require('../server.js');
chai.use(chaiHttp);

describe('Server test', () => {
  before(() => { console.log('before test'); });
  after(() => { console.log('after test'); });

  // test route 1 read.js
  describe('Test Route 1 - get product list', () => {
    it('Test Case 1 - should have status of 200', (done) => {
      chai.request(url)
          .get('/getItem')
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
    });
    it('Test Case 2 - should exist and be an array', (done) => {
      chai.request(url)
          .get('/getItem')
          .end((err, res) => {
            should.exist(res.body);
            res.body.should.be.a('array');
            id = res.body[0]._id;
            done();
          });
    });
  });

  //test route 2 readOne.js
  describe('Test Route 2 - get one product', () => {
    it('Test Case 1 - success: array length should be 1', (done) => {
      chai.request(url)
          .post('/getOneItem')
          .type('form')
          .send({'objId': id})
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.lengthOf(1);
            done();
          });
    });
    it('Test Case 2 - success: name should equal to milk', (done) => {
      chai.request(url)
          .post('/getOneItem')
          .type('form')
          .send({'objId': id})
          .end((err, res) => {
            res.body[0].name.should.equal('milk');
            done();
          });
    });
    it('Test Case 3 - fail: not exist id, error: item not exist', (done) => {
      chai.request(url)
          .post('/getOneItem')
          .type('form')
          .send({'objId': fakeObjId})
          .end((err, res) => {
            res.body.errorMsg.should.equal('item does not exist');
            done();
          });      
    });
  });

  //test route 3 add.js
  describe('Test Route 3 - insert data, use same data for both test case', () => {
    const data = {'id': 10000, 'name': 'InsertTesting1', 'description': 'data for test1', 'price': 0, 'units': 1};
    const dataSame = {'id': 20000, 'name': 'InsertTesting2', 'description': 'data for test2', 'price': 0, 'units': 1};
    it('Test Case 1 - success: should have num of 1', (done) => {
      chai.request(url)
          .post('/addItem')
          .type('form')
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            // console.log(res.body);
            res.body.num.should.equal(1);
            done();
          });
    });
    it('Test Case 2 - success: should have null for error', (done) => {
      chai.request(url)
          .post('/addItem')
          .type('form')
          .send(dataSame)
          .end((err, res) => {
            should.equal(res.body.error, null);
            done();
          });
    });
    it('Test Case 3 - fail: insert same data, error: id already exisit', (done) => {
      chai.request(url)
          .post('/addItem')
          .type('form')
          .send(dataSame)
          .end((err, res) => {
            should.equal(res.body.errorMsg, 'id already exisit');
            done();
          });
    });
  }); 

  //test route 4 update.js
  describe('Test Route 4 - update data', () => {
    let data = {'objId': id.toString, 'id': 5000, 'name': 'update to new', 'description': 'data for update', 'price': 0, 'units': 1};
    it('Test Case 1 - success: return value should have ok as property', (done) => {
      data.objId = id;
      chai.request(url)
          .post('/updateItem')
          .type('form')
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('ok');
            done();
          });
    });
    it('Test Case 2 - success: return value should should be true', (done) => {
      chai.request(url)
          .post('/updateItem')
          .type('form')
          .send(data)
          .end((err, res) => {
            res.body.ok.should.equal(true);
            done();
          });
    });
    it('Test Case 3 - fail: return value should should be false', (done) => {
      data.objId = fakeObjId;
      chai.request(url)
          .post('/updateItem')
          .type('form')
          .send(data)
          .end((err, res) => {
            res.body.ok.should.equal(false);
            done();
          });
    });

  });


  //test route 5 remove.js
  describe('Test Route 5 - remove data', () => {
    it('Test Case 1 - success: return value should be an array', (done) => {
      chai.request(url)
          .post('/deleteItem')
          .type('form')
          .send({'objId': id})
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            id = res.body[0]._id;
            done();
          });
    });
    it('Test Case 2 - success: return value should have property: name, id, price, units, description', (done) => {
      chai.request(url)
          .post('/deleteItem')
          .type('form')
          .send({'objId': id})
          .end((err, res) => {
            res.body[0].should.have.property('name');
            res.body[0].should.have.property('id');
            res.body[0].should.have.property('price');
            res.body[0].should.have.property('units');
            res.body[0].should.have.property('description');
            done();
          });
    });
    it('Test Case 3 - fail: return value should be false', (done) => {
      chai.request(url)
          .post('/deleteItem')
          .type('form')
          .send({'objId': fakeObjId})
          .end((err, res) => {
            res.body.ok.should.equal(false);
            done();
          });
    });
  });  

});
