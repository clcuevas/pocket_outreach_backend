'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');

mongoose.Promise = Promise;

const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const proxyquire = require('proxyquire');
const getFoodBank = require('./getFoodBank');
const FoodBank = require('../../models/FoodBank');

describe('getFoodBank', () => {

  before(function(done) {
    this.timeout(120000);

    mockgoose.prepareStorage()
    .then(() => {
      mongoose.connect('mongodb://example.com/TestingDB', (err) => {
        if (err) done(err);
        done();
      });
    });
  });

  it('should send a 200 status when a valid query string is included and return the closest food bank', (done) => {
    const req = {
      query: {
        latitude: '47.673554',
        longitude: '-122.387062'
      }
    };

    const testFoodBank1 = new FoodBank({
      address : '123 1st st',
      city_feature : 'Food Banks',
      common_name : 'Test Food Bank 1',
      latitude : '47.546769',
      longitude : '-122.300331',
      location : {
        location_type : 'Point',
        coordinates : [
          -122.300331,
          47.546769
        ]
      }
    });

    const testFoodBank2 = new FoodBank({
      address : '123 2nd St',
      city_feature : 'Food Banks',
      common_name : 'Test Food Bank 2',
      latitude : '47.515561',
      longitude : '-122.284441',
      website : 'http://example.com',
      location : {
        location_type : 'Point',
        coordinates : [
          -122.284441,
          47.515561
        ]
      }
    });

    const testFoodBank3 = new FoodBank({
      address: '123 3rd st',
      city_feature: 'Food Banks',
      common_name: 'Closest Food Bank',
      latitude: '47.679582',
      longitude: '-122.387661',
      website: 'http://coconut.com',
      location: {
        location_type: 'Point',
        coordinates: [
          -122.387661,
          47.679582
        ]
      }
    });
    const promises = [testFoodBank1.save(), testFoodBank2.save(), testFoodBank3.save()];

    //noinspection JSUnusedLocalSymbols
    Promise.all(promises)
    // eslint-disable-next-line
    .then( foodBanks => {
      getFoodBank(req, {}, (err) => {
        if (err) done(err);

        expect(req.returnVal.data.common_name).to.equal('Closest Food Bank');
        expect(req.returnVal.status).to.equal(200);
        done();
      });
    });
  });

  it('should return a 400 status and missing query message when no latitude is provided', (done) => {
    const req = {
      query: {
        longitude: '-122.387062'
      }
    };

    getFoodBank(req, {}, (err) => {
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

    getFoodBank(req, {}, (err) => {
      if (err) done(err);

      expect(req.returnVal.data.error).to.equal('Invalid or missing query string');
      expect(req.returnVal.status).to.equal(400);
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
    let getClosestHotMeal = proxyquire('./getFoodBank', {'../../models/FoodBank': foodBankStub});

    getClosestHotMeal(req, {}, (err) => {
      expect(err).to.equal(testError);
      done();
    });

  });


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

