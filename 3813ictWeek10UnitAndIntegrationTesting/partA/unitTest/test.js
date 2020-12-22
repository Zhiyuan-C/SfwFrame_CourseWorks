var assert = require('assert');
const linearPoint = require('../linearPoint.js');
describe('Testing for linearPoint function', () => {
  it('Test case 1 - should return 6', () => {
    assert.equal(linearPoint(2, 1, 4), 6);
  });
  it('Test case 2 - should return 4', () => {
    assert.equal(linearPoint(2, 0, 4), 4);
  });
  it('Test case 2 - should return 2', () => {
    assert.equal(linearPoint(2, -1, 4), 2);
  });
});