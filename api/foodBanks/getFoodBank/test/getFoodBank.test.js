'use strict';

const expect = require('chai').expect;
const nock = require('nock');

const getFoodBank = require('../getFoodBank');
const testFoodBankData = require('./foodBankTestData.json');

describe('getFoodBank', () => {
  let env;

  before(() => {
    // prevent contamination of environment variables
    env = process.env;
    // create test environment variables
    process.env.SEATTLE_FOOD_BANK_RESOURCE = 'fake-data.json';
    process.env.SEATTLE_DATA_BASE_PATH = 'resource';
    process.env.SEATTLE_DATA_BASE_URL = 'https://example.com';
    process.env.SEATTLE_DATA_API_KEY = 'fakeAPIKey';

    nock(process.env.SEATTLE_DATA_BASE_URL, {
      reqheaders: {
        'X-App-Token': process.env.SEATTLE_DATA_API_KEY,
        'Accept': 'application/json'
      }
    })
    .get(`/${process.env.SEATTLE_DATA_BASE_PATH}/${process.env.SEATTLE_FOOD_BANK_RESOURCE}`)
    .query({city_feature: 'Food Banks' })
    .reply(200, testFoodBankData);
  });

  it('should send a 200 status interpret a query string and return the closest food bank when required query is provided', (done) => {
    const req = {
      query: {
        latitude: '47.673554',
        longitude: '-122.387062'
      }
    };

    getFoodBank(req, {}, (err) => {
      expect(err).to.not.exist;
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

    getFoodBank(req, {}, (err) => {
      expect(err).to.not.exist;
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

    getFoodBank(req, {}, (err) => {
      expect(err).to.not.exist;
      expect(req.returnVal.data.error).to.equal('Invalid or missing query string');
      expect(req.returnVal.status).to.equal(400);
      done();
    });

  });

// restoring everything back
  after( () => {
    process.env = env;
  });
});
