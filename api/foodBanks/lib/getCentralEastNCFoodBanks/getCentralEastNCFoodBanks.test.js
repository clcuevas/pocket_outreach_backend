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
const testSocrataData = JSON.stringify(require('./centralEastNCFoodBanksTestData.json'));

describe('getCentralEastNCFoodBanks', function() {
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
      .reply(200, testSocrataData);

    process.env.SOCRATA_DATA_API_KEY = 'fakeApiKey';
    nock(testUrl2, {
      reqheaders: {
        'X-App-Token': process.env.SOCRATA_DATA_API_KEY,
        'Accept': 'application/json'
      }
    })
      .get('/')
      .replyWithError(testError2);

    mockgoose.prepareStorage().then(() => {
      mongoose.connect('mongodb://example.com/TestingDB', (err) => {
        if (err) done(err);
        done();
      });
    });
  });

  // it('should get food banks from Socrata and add them to the database', function(done) {
  //   const getSeattleFoodBanks = require('./getSeattleFoodBanks');
  //   const errorHandler = sinon.spy();
  //
  //   getSeattleFoodBanks(testUrl, errorHandler);
  //   setTimeout(() => {
  //     FoodBank.find((err, foundFoodBanks) => {
  //       if (err) done(err);
  //       expect(foundFoodBanks).to.exist;
  //       expect(foundFoodBanks.length).to.equal(5);
  //       expect(errorHandler.called).to.equal(false);
  //       done();
  //     });
  //   }, 1000);
  // });


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
