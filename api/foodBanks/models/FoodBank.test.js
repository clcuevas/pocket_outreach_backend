'use strict';

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const expect = require('chai').expect;

const FoodBank = require('./FoodBank');

describe('FoodBank Model', function() {
  //extend timeout for mockgoose
  this.timeout(120000);

  before(function(done) {
    process.env.SOCRATA_DATA_API_KEY = 'fakeApiKey';

    mockgoose.prepareStorage().then(() => {
      mongoose.connect('mongodb://example.com/TestingDB', (err) => {
        if (err) done(err);
        done();
      });
    });
  });

  it('should require common_name', function (done) {
    const testFoodBank = new FoodBank({
      latitude: 1,
      longitude: 2
    });

    testFoodBank.save((err) => {
      expect(err).to.exist;
      expect(err.message).to.equal('FoodBank validation failed: common_name: Path `common_name` is required.');
      done();
    });
  });

  it('should require latitude', function (done) {
    const testFoodBank = new FoodBank({
      common_name: 'test food bank',
      longitude: 2
    });

    testFoodBank.save((err) => {
      expect(err).to.exist;
      expect(err.message).to.equal('FoodBank validation failed: latitude: Path `latitude` is required.');
      done();
    });
  });

  it('should require longitude', function (done) {
    const testFoodBank = new FoodBank({
      common_name: 'test food bank',
      latitude: 2
    });

    testFoodBank.save((err) => {
      expect(err).to.exist;
      expect(err.message).to.equal('FoodBank validation failed: longitude: Path `longitude` is required.');
      done();
    });
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
