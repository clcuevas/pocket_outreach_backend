'use strict';
const expect = require('chai').expect;
const mongoose = require('mongoose');

mongoose.Promise = Promise;

const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const proxyquire = require('proxyquire');

const getFoodBanks = require('./getFoodBanks');
const FoodBank = require('../../models/FoodBank');
const getFoodBanksTestData = require('./getFoodBanksTestData.json');

describe('getFoodBanks', () => {
  // eslint-disable-next-line no-unused-vars
  let foodBanks;

  before(function(done) {
    this.timeout(120000);

    mockgoose.prepareStorage()
      .then(() => {
        mongoose.connect('mongodb://example.com/TestingDB', (err) => {
          if (err) done(err);
          const promises = [];
          for (const location of getFoodBanksTestData) {
            const foodBankToSave = new FoodBank(location);
            promises.push(foodBankToSave.save());
          }
          Promise.all(promises)
            .then(savedFoodBanks => {
              foodBanks = savedFoodBanks;
              done();
            });
        });
      });
  });

  it('should return all food banks unsorted when no limit is set and neither latitude nor longitude are included', (done) => {
    const req = {};

    getFoodBanks(req, {}, (err) => {
      if (err) done(err);
      expect(req.returnVal.data.length).to.equal(5);
      expect(req.returnVal.data[0]).to.have.all.keys('type', 'id', 'attributes');
      expect(req.returnVal.data[0].attributes).to.have.all.keys('address', 'city_feature', 'common_name', 'website', 'longitude', 'latitude');
      expect(req.returnVal.status).to.equal(200);
      done();
    });
  });

  it('should return 2 food banks unsorted when limit is set to 2', (done) => {
    const req = {
      query: {
        limit: '2'
      }
    };

    getFoodBanks(req, {}, (err) => {
      if (err) done(err);
      expect(req.returnVal.data.length).to.equal(2);
      expect(req.returnVal.data[0]).to.have.all.keys('type', 'id', 'attributes');
      expect(req.returnVal.data[0].attributes).to.have.all.keys('address', 'city_feature', 'common_name', 'website', 'longitude', 'latitude');
      expect(req.returnVal.status).to.equal(200);
      done();
    });
  });

  it('should return all food banks when latitude and longitude are set, but limit is not included', (done) => {
    const req = {
      query: {
        latitude: '47.6795200',
        longitude: '-122.3875480',
      }
    };

    getFoodBanks(req, {}, (err) => {
      if (err) done(err);
      expect(req.returnVal.data.length).to.equal(5);
      expect(req.returnVal.data[0].attributes.common_name).to.equal(getFoodBanksTestData[3].common_name);
      expect(req.returnVal.data[1].attributes.common_name).to.equal(getFoodBanksTestData[0].common_name);
      expect(req.returnVal.data[2].attributes.common_name).to.equal(getFoodBanksTestData[2].common_name);
      expect(req.returnVal.data[3].attributes.common_name).to.equal(getFoodBanksTestData[4].common_name);
      expect(req.returnVal.data[4].attributes.common_name).to.equal(getFoodBanksTestData[1].common_name);
      expect(req.returnVal.status).to.equal(200);
      done();
    });
  });

  it('should return the nearest 3 food banks when limit set to 3 and latitude and longitude are included', (done) => {
    const req = {
      query: {
        latitude: '47.6795200',
        longitude: '-122.3875480',
        limit: '3'
      }
    };

    getFoodBanks(req, {}, (err) => {
      if (err) done(err);
      expect(req.returnVal.data.length).to.equal(3);
      expect(req.returnVal.data[0].attributes.common_name).to.deep.equal(getFoodBanksTestData[3].common_name);
      expect(req.returnVal.data[1].attributes.common_name).to.deep.equal(getFoodBanksTestData[0].common_name);
      expect(req.returnVal.data[2].attributes.common_name).to.deep.equal(getFoodBanksTestData[2].common_name);
      expect(req.returnVal.status).to.equal(200);
      done();
    });
  });

  it('should return a 400 status and missing query error when no latitude is provided, but longitude is provided', (done) => {
    const req = {
      query: {
        longitude: '-122.387062'
      }
    };

    const testReturnVal = {
      errors: [ {
        error: 'must provide both latitude and longitude in query',
        title: 'query error',
        status: 400
      } ]
    };

    getFoodBanks(req, {}, (err) => {
      if (err) done(err);
      expect(req.returnVal.errors.length).to.equal(1);
      expect(req.returnVal.errors[0]).to.deep.equal(testReturnVal.errors[0]);
      done();
    });

  });

  it('should return a 400 status and missing query error when no longitude is provided, but latitude is provided', (done) => {
    const req = {
      query: {
        latitude: '47.673554'
      }
    };
    const testReturnVal = {
      errors: [ {
        error: 'must provide both latitude and longitude in query',
        title: 'query error',
        status: 400
      } ]
    };

    getFoodBanks(req, {}, (err) => {
      if (err) done(err);
      expect(req.returnVal.errors.length).to.equal(1);
      expect(req.returnVal.errors[0]).to.deep.equal(testReturnVal.errors[0]);
      done();
    });

  });

  it('should call next on the error when the database returns an error', function (done) {
    const testError = new Error('the sky is falling');
    const foodBankStub = {
      find: callback => {
        callback(testError);
      }
    };
    const req = {
      query: {
        latitude: '47.6795200',
        longitude: '-122.3875480'
      }
    };
    // eslint-disable-next-line
    let getHotMeals = proxyquire('./getFoodBanks', {'../../models/FoodBank': foodBankStub});

    getHotMeals(req, {}, (err) => {
      expect(err).to.equal(testError);
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
