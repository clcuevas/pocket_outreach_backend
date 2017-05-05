'use strict';

const expect = require('chai').expect;
const nock = require('nock');
const sinon = require('sinon');
const config = require('config');
const seattleFoodBankApi = config.get('resources.socrata.food_banks.seattle');
const getFoodBank = require('./../getFoodBank');
const testFoodBankData = require('./foodBankTestData.json');

describe('getFoodBank', () => {
  describe('get', () => {
    let env;

    before(() => {
      // prevent contamination of environment variables
      env = process.env;
      // create test environment variables
      process.env.SOCRATA_DATA_API_KEY = 'fakeAPIKey';

      nock(seattleFoodBankApi.toString(), {
        reqheaders: {
          'X-App-Token': process.env.SOCRATA_DATA_API_KEY,
          'Accept': 'application/json'
        }
      })
      .get('')
      .query({city_feature: 'Food Banks' })
      .times(3)
      .reply(200, testFoodBankData);
    });

    it('should send a 200 status when a valid query string is included and return the closest food bank', (done) => {
      const req = {
        query: {
          latitude: '47.673554',
          longitude: '-122.387062'
        }
      };

      getFoodBank.get(req, {}, (err) => {
        if (err) done(err);

        expect(req.returnVal.data.common_name).to.equal('Ballard Food Bank');
        expect(req.returnVal.status).to.equal(200);
        done();
      });

    });

    it('should return a 400 status and missing query message when no latitude is provided', (done) => {
      const req = {
        query: {
          longitude: '-122.387062'
        }
      };

      getFoodBank.get(req, {}, (err) => {
        if (err) done(err);

        expect(req.returnVal.data.error).to.equal('Invalid or missing query string');
        expect(req.returnVal.status).to.equal(400);
        done();
      });

    });

    it('should return a 400 status and missing query message when no longitude is provided', (done) => {
      const req = {
        query: {
          latitude: '47.673554'
        }
      };

      getFoodBank.get(req, {}, (err) => {
        if (err) done(err);

        expect(req.returnVal.data.error).to.equal('Invalid or missing query string');
        expect(req.returnVal.status).to.equal(400);
        done();
      });

    });

// restoring everything back
    after( () => {
      process.env = env;
      if (!nock.isDone()) {
        nock.cleanAll();
      }
    });
  });
  describe('endpoint', () => {

    it('should send the returnVal status and returnVal data when included', (done) => {

      const req = {
        returnVal: {
          status: 420,
          data: {
            state: 'of mind',
            needs: 'tacos'
          }
        }
      };

      const res = {
        json: sinon.spy(),
        status: sinon.spy()
      };

      Promise.resolve(getFoodBank.endpoint(req, res))
      .then(() => {
        expect(res.status.calledWith(420), 'did not set status when returnVal.status was included').to.equal(true);
        expect(res.json.calledWith(req.returnVal.data), 'did not send data when returnVal.data was included ').to.equal(true);
        done();
      })
      .catch(err => { done(err); });
    });

    it('should return 400 status and error message when returnVal is not included', (done) => {
      const res = {
        json: sinon.spy(),
        status: sinon.spy()
      };

      Promise.resolve(getFoodBank.endpoint({}, res))
      .then(() => {
        expect(res.status.calledWith(400), 'did not send 400 when missing returnVal').to.equal(true);
        expect(res.json.calledWith({ 'error' : 'sorry we couldn\'t interpret you\'re request' }), 'did not send error message when missing returnVal').to.equal(true);
        done();
      })
      .catch(err => { done(err); });
    });
  });
});

