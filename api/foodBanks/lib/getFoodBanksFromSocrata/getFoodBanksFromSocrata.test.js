'use strict';

const mongoose = require('mongoose');

mongoose.Promise = Promise;

const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const expect = require('chai').expect;
const nock = require('nock');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const FoodBank = require('../../models/FoodBank');
const testSocrataData = JSON.stringify(require('./getFoodBankFromSocrataTestData.json'));

describe('getFoodBanksFromSocrata', function() {
  //extend timeout for mockgoose
  this.timeout(120000);
  // prevent contamination of environment variables
  const env = process.env;
  const testUrl = 'http://example.com';
  const testUrl2 ='http://blahblah.com';
  const testError2 = new Error('something awful happened');

  before(function(done) {
    process.env.SOCRATA_DATA_API_KEY = 'fakeApiKey';
    nock(testUrl, {
      reqheaders: {
        'X-App-Token': process.env.SOCRATA_DATA_API_KEY,
        'Accept': 'application/json'
      }
    })
    .get('/')
    .times(2)
    .query({city_feature: 'Food Banks'})
    .reply(200, testSocrataData);

    process.env.SOCRATA_DATA_API_KEY = 'fakeApiKey';
    nock(testUrl2, {
      reqheaders: {
        'X-App-Token': process.env.SOCRATA_DATA_API_KEY,
        'Accept': 'application/json'
      }
    })
    .get('/')
    .query({city_feature: 'Food Banks'})
    .replyWithError(testError2);

    mockgoose.prepareStorage().then(() => {
      mongoose.connect('mongodb://example.com/TestingDB', (err) => {
        if (err) done(err);
        else done();
      });
    });
  });

  it('should get food banks from Socrata and add them to the database', function(done) {
    const getFoodBanksFromSocrata = require('./getFoodBanksFromSocrata');
    const errorHandler = sinon.spy();

    getFoodBanksFromSocrata(testUrl, errorHandler);
    setTimeout(() => {
      FoodBank.find((err, foundFoodBanks) => {
        if (err) done(err);
        expect(foundFoodBanks).to.exist;
        expect(foundFoodBanks.length).to.equal(5);
        expect(errorHandler.called).to.equal(false);
        done();
      });
    }, 1000);
  });

  it('should call callback with an error if an error is returned from supergoose', function (done) {
    const getFoodBanksFromSocrata = require('./getFoodBanksFromSocrata');

    function errorHandlerStub(error) {
      expect(error).to.deep.equal(testError2);
      done();
    }

    getFoodBanksFromSocrata(testUrl2, errorHandlerStub);

  });

  it('should call callback with an error if an error is returned from Mongo', function (done) {
    const testError = new Error('foul ball');
    const FoodBankStub = {
      findOneAndUpdate: (query, obj, options, callback) => {
        callback(testError);
      }
    };

    function errorHandlerStub(error) {
      expect(error).to.equal(testError);
      done();
    }
    // eslint-disable-next-line
    let getFoodBanksFromSocrata = proxyquire('./getFoodBanksFromSocrata', {'../../models/FoodBank': FoodBankStub});

    getFoodBanksFromSocrata(testUrl, errorHandlerStub);

  });

  // restoring everything back
  after( (done) => {
    process.env = env;

    mockgoose.prepareStorage()
    .then(() => {
      mockgoose.helper.reset().then(() => {
        mongoose.connection.close((err) => {
          if (err) done(err);
          if (!nock.isDone()) {
            nock.cleanAll();
          }
          done();
        });
      });
    });
  });
});
