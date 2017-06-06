'use strict';
const expect = require('chai').expect;
const mongoose = require('mongoose');

mongoose.Promise = Promise;

const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const proxyquire = require('proxyquire');

const getHotMeals = require('./getHotMeals');
const HotMealLocation = require('../../models/HotMealLocation');
const getHotMealsTestData = require('./getHotMealsTestData.json');

describe('getHotMeals', () => {
  let hotMealLocations;

  before(function(done) {
    this.timeout(120000);

    mockgoose.prepareStorage()
      .then(() => {
        mongoose.connect('mongodb://example.com/TestingDB', (err) => {
          if (err) done(err);
          done();
        });
      });

    const promises = [];
    for (const location of getHotMealsTestData) {
      const hotMealLocation = new HotMealLocation(location);
      promises.push(hotMealLocation.save());
    }
    Promise.all(promises)
      .then(savedHotMealLocations => hotMealLocations = savedHotMealLocations);
  });

  it('should return all venues unsorted with a hot meal when no limit is set and neither latitude nor longitude are included', (done) => {
    const req = {};

    getHotMeals(req, {}, (err) => {
      if (err) done(err);
      expect(req.returnVal.data.length).to.equal(5);
      expect(req.returnVal.data[0]._doc).to.have.all.keys('day_time', 'location', 'meal_served', 'name_of_program', 'people_served', 'longitude', 'latitude', '_id', '__v');
      expect(req.returnVal.status).to.equal(200);
      done();
    });
  });

  it('should return 2 venues unsorted with a hot meal when limit is set to 2', (done) => {
    const req = {
      query: {
        limit: '2'
      }
    };

    getHotMeals(req, {}, (err) => {
      if (err) done(err);
      expect(req.returnVal.data.length).to.equal(2);
      expect(req.returnVal.data[0]._doc).to.have.all.keys('day_time', 'location', 'meal_served', 'name_of_program', 'people_served', 'longitude', 'latitude', '_id', '__v');
      expect(req.returnVal.status).to.equal(200);
      done();
    });
  });

  it('should return all venues with a hot meal latitude and longitude are set, but limit is not inluded', (done) => {
    const req = {
      query: {
        latitude: '47.6795200',
        longitude: '-122.3875480',
      }
    };

    getHotMeals(req, {}, (err) => {
      if (err) done(err);
      expect(req.returnVal.data.length).to.equal(5);
      expect(req.returnVal.data[0]._id).to.deep.equal(hotMealLocations[4]._id);
      expect(req.returnVal.data[1]._id).to.deep.equal(hotMealLocations[3]._id);
      expect(req.returnVal.data[2]._id).to.deep.equal(hotMealLocations[2]._id);
      expect(req.returnVal.data[3]._id).to.deep.equal(hotMealLocations[0]._id);
      expect(req.returnVal.data[4]._id).to.deep.equal(hotMealLocations[1]._id);
      expect(req.returnVal.status).to.equal(200);
      done();
    });
  });

  it('should return the nearest 3 venues with a hot meal when limit set to 3 and latitude and longitude are included', (done) => {
    const req = {
      query: {
        latitude: '47.6795200',
        longitude: '-122.3875480',
        limit: '3'
      }
    };

    getHotMeals(req, {}, (err) => {
      if (err) done(err);
      expect(req.returnVal.data.length).to.equal(3);
      expect(req.returnVal.data[0].location).to.equal('5710 22nd Ave. NW  Seattle');
      expect(req.returnVal.data[0]._id).to.deep.equal(hotMealLocations[4]._id);
      expect(req.returnVal.data[1]._id).to.deep.equal(hotMealLocations[3]._id);
      expect(req.returnVal.data[2]._id).to.deep.equal(hotMealLocations[2]._id);
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

    getHotMeals(req, {}, (err) => {
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

    getHotMeals(req, {}, (err) => {
      if (err) done(err);
      expect(req.returnVal.errors.length).to.equal(1);
      expect(req.returnVal.errors[0]).to.deep.equal(testReturnVal.errors[0]);
      done();
    });

  });

  it('should call next on the error when the database returns an error', function (done) {
    const testError = new Error('the sky is falling');
    const hotMealStub = {
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
    let getClosestHotMeal = proxyquire('./getHotMeals', {'../../models/HotMealLocation': hotMealStub});

    getClosestHotMeal(req, {}, (err) => {
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
