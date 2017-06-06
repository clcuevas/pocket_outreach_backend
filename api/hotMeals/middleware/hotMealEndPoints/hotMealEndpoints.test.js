'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const hotMealEndpoints = require('./hotMealEndPoints');

describe('hotMealEndpoints', () => {

  it('should return 400 status and error message when returnVal is not included', (done) => {
    const res = {
      json: sinon.spy(),
      status: sinon.spy()
    };

    Promise.resolve(hotMealEndpoints({}, res))
      .then(() => {
        expect(res.status.calledWith(400), 'did not send 400 when missing returnVal').to.equal(true);
        expect(res.json.calledWith({ 'error' : 'sorry we couldn\'t interpret you\'re request' }), 'did not send error message when missing returnVal').to.equal(true);
        done();
      })
      .catch(err => done(err) );
  });

  it('should send the returnVal status and returnVal data when included', (done) => {

    const req = {
      returnVal: {
        status: 420,
        data: [ {
          state: 'of mind',
          needs: 'tacos'
        } ]
      }
    };

    const res = {
      json: sinon.spy(),
      status: sinon.spy()
    };

    Promise.resolve(hotMealEndpoints(req, res))
      .then(() => {
        expect(res.status.calledWith(420), 'did not set status when returnVal.status was included').to.equal(true);
        expect(res.json.calledWith(req.returnVal), 'did not send data when returnVal.data was included ').to.equal(true);
        done();
      })
      .catch(err => done(err) );
  });

});
