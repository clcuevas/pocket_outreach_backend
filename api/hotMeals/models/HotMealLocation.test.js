'use strict';

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const expect = require('chai').expect;

const HotMealLocation = require('./HotMealLocation');

describe('HotMealLocation Model', function() {
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

  it('should require name_of_program', function (done) {
    const testHotMealLocation = new HotMealLocation({
      latitude: 1,
      longitude: 2
    });

    testHotMealLocation.save((err) => {
      expect(err).to.exist;
      expect(err.message).to.equal('HotMealLocation validation failed: name_of_program: Path `name_of_program` is required.');
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
