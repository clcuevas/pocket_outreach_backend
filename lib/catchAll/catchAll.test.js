'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const catchAll = require('./catchAll');

describe('catchAll', function () {

  it('should return status 404 and send the catch all not found error object', function (done) {
    const resStub = {
      status: sinon.spy(),
      json: sinon.spy()
    };

    const err = {
      errors: [ {
        title: 'Error 404 : not found',
        error: 'oops we didn\'t find anything, check out https://data.pocketoutreach.org for available API endpoints and documentation',
        status: 404
      } ]
    };

    catchAll({}, resStub);
    expect(resStub.status.calledWith(404)).to.equal(true);
    expect(resStub.json.calledWith(err)).to.equal(true);
    done();
  });
});
