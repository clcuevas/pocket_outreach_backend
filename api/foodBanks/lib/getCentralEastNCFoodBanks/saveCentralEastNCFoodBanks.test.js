'use strict';

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const proxyquire = require('proxyquire');
const expect = require('chai').expect;
const saveCentralEastNCFoodBanks = require('./saveCentralEastNCFoodBanks');
const centralEastNCFoodBankTestData = require('./centralEastNCFoodBanksTestData.json');
const FoodBank = require('../../models/FoodBank');

describe('saveCentralEastNCFoodBanks', function () {
  //extend timeout for mockgoose
  this.timeout(120000);

  before(function(done) {

    mockgoose.prepareStorage().then(() => {
      mongoose.connect('mongodb://example.com/TestingDB', (err) => {
        if (err) done(err);
        done();
      });
    });
  });

  it('should extract an Eastern NC food bank and format it to match the FoodBank schema', function (done) {
    saveCentralEastNCFoodBanks(centralEastNCFoodBankTestData);
    setTimeout(() => {
      FoodBank.find((err, foundFoodBanks) => {
        if (err) done(err);
        expect(foundFoodBanks).to.exist;
        expect(foundFoodBanks.length).to.equal(5);
        done();
      });
    }, 1000);
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
    let saveCentralEastNCFoodBanks = proxyquire('./saveCentralEastNCFoodBanks', {'../../models/FoodBank': FoodBankStub});

    saveCentralEastNCFoodBanks([ centralEastNCFoodBankTestData[0] ], errorHandlerStub);

  });

  // restoring everything back
  after( (done) => {

    mockgoose.prepareStorage()
      .then(() => {
        mockgoose.helper.reset().then(() => {
          mongoose.connection.close((err) => {
            if (err) done(err);
            done();
          });
        });
      });
  });
});
