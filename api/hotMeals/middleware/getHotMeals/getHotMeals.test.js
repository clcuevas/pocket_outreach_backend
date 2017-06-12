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
  // eslint-disable-next-line no-unused-vars
  let hotMealLocations;

  before(function(done) {
    this.timeout(120000);

    mockgoose.prepareStorage()
      .then(() => {
        mongoose.connect('mongodb://example.com/TestingDB', (err) => {
          if (err) done(err);
          const promises = [];
          for (const location of getHotMealsTestData) {
            const hotMealLocation = new HotMealLocation(location);
            promises.push(hotMealLocation.save());
          }
          Promise.all(promises)
            .then(savedHotMealLocations => {
              hotMealLocations = savedHotMealLocations;
              done();
            });
        });
      });
  });

  it('should return all venues unsorted with a hot meal when no limit is set and neither latitude nor longitude are included', (done) => {
    const req = {};

    getHotMeals(req, {}, (err) => {
      if (err) done(err);
      expect(req.returnVal.data.length).to.equal(5);
      expect(req.returnVal.data[0]).to.have.all.keys('type', 'id', 'attributes');
      expect(req.returnVal.data[0].attributes).to.have.all.keys('day_time', 'location', 'meal_served', 'name_of_program', 'people_served', 'longitude', 'latitude');
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
      expect(req.returnVal.data[0]).to.have.all.keys('type', 'id', 'attributes');
      expect(req.returnVal.data[0].attributes).to.have.all.keys('day_time', 'location', 'meal_served', 'name_of_program', 'people_served', 'longitude', 'latitude');
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
      expect(req.returnVal.data[0].attributes.name_of_program).to.equal(getHotMealsTestData[4].name_of_program);
      expect(req.returnVal.data[1].attributes.name_of_program).to.equal(getHotMealsTestData[3].name_of_program);
      expect(req.returnVal.data[2].attributes.name_of_program).to.equal(getHotMealsTestData[2].name_of_program);
      expect(req.returnVal.data[3].attributes.name_of_program).to.equal(getHotMealsTestData[0].name_of_program);
      expect(req.returnVal.data[4].attributes.name_of_program).to.equal(getHotMealsTestData[1].name_of_program);
      expect(req.returnVal.data[0].attributes.location).to.equal(getHotMealsTestData[4].location);
      expect(req.returnVal.data[1].attributes.location).to.equal(getHotMealsTestData[3].location);
      expect(req.returnVal.data[2].attributes.location).to.equal(getHotMealsTestData[2].location);
      expect(req.returnVal.data[3].attributes.location).to.equal(getHotMealsTestData[0].location);
      expect(req.returnVal.data[4].attributes.location).to.equal(getHotMealsTestData[1].location);
      expect(req.returnVal.data[0].attributes.latitude).to.equal(getHotMealsTestData[4].latitude);
      expect(req.returnVal.data[1].attributes.latitude).to.equal(getHotMealsTestData[3].latitude);
      expect(req.returnVal.data[2].attributes.latitude).to.equal(getHotMealsTestData[2].latitude);
      expect(req.returnVal.data[3].attributes.latitude).to.equal(getHotMealsTestData[0].latitude);
      expect(req.returnVal.data[4].attributes.latitude).to.equal(getHotMealsTestData[1].latitude);
      expect(req.returnVal.data[0].attributes.longitude).to.equal(getHotMealsTestData[4].longitude);
      expect(req.returnVal.data[1].attributes.longitude).to.equal(getHotMealsTestData[3].longitude);
      expect(req.returnVal.data[2].attributes.longitude).to.equal(getHotMealsTestData[2].longitude);
      expect(req.returnVal.data[3].attributes.longitude).to.equal(getHotMealsTestData[0].longitude);
      expect(req.returnVal.data[4].attributes.longitude).to.equal(getHotMealsTestData[1].longitude);
      expect(req.returnVal.data[0].attributes.day_time).to.equal(getHotMealsTestData[4].day_time);
      expect(req.returnVal.data[1].attributes.day_time).to.equal(getHotMealsTestData[3].day_time);
      expect(req.returnVal.data[2].attributes.day_time).to.equal(getHotMealsTestData[2].day_time);
      expect(req.returnVal.data[3].attributes.day_time).to.equal(getHotMealsTestData[0].day_time);
      expect(req.returnVal.data[4].attributes.day_time).to.equal(getHotMealsTestData[1].day_time);
      expect(req.returnVal.data[0].attributes.meal_served).to.equal(getHotMealsTestData[4].meal_served);
      expect(req.returnVal.data[1].attributes.meal_served).to.equal(getHotMealsTestData[3].meal_served);
      expect(req.returnVal.data[2].attributes.meal_served).to.equal(getHotMealsTestData[2].meal_served);
      expect(req.returnVal.data[3].attributes.meal_served).to.equal(getHotMealsTestData[0].meal_served);
      expect(req.returnVal.data[4].attributes.meal_served).to.equal(getHotMealsTestData[1].meal_served);
      expect(req.returnVal.data[0].attributes.people_served).to.equal(getHotMealsTestData[4].people_served);
      expect(req.returnVal.data[1].attributes.people_served).to.equal(getHotMealsTestData[3].people_served);
      expect(req.returnVal.data[2].attributes.people_served).to.equal(getHotMealsTestData[2].people_served);
      expect(req.returnVal.data[3].attributes.people_served).to.equal(getHotMealsTestData[0].people_served);
      expect(req.returnVal.data[4].attributes.people_served).to.equal(getHotMealsTestData[1].people_served);
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
      expect(req.returnVal.data[0].attributes.name_of_program).to.deep.equal(getHotMealsTestData[4].name_of_program);
      expect(req.returnVal.data[1].attributes.name_of_program).to.deep.equal(getHotMealsTestData[3].name_of_program);
      expect(req.returnVal.data[2].attributes.name_of_program).to.deep.equal(getHotMealsTestData[2].name_of_program);
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
    // eslint-disable-next-line prefer-const
    let getClosestHotMeal = proxyquire('./getHotMeals', { '../../models/HotMealLocation': hotMealStub });

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
