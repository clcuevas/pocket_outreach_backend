'use strict';

const mongoose = require('mongoose');

mongoose.Promise = Promise;

const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const expect = require('chai').expect;
const nock = require('nock');
const config = require('config');
const googleLocationApi = config.get('resources.google.location_api');
const HotMealLocation = require('../../models/HotMealLocation');
const addLatLngFromGoogle = require('../addLatLngFromGoogle');
const googleData = {
  results: [
    {
      geometry: {
        location: {
          lat: '47.612259',
          lng: '-122.319318'
        }
      }
    }
  ]
};

describe('addLatLngFromGoogle', function() {
  let env;

  before(function(done) {
    this.timeout(120000);
    env = process.env;
    // create test environment variables
    process.env.GOOGLE_API_KEY = 'fakeGoogleAPIKey';

    nock(googleLocationApi)
    .get('')
    .query(true)
    .reply(200, googleData);

    mockgoose.prepareStorage()
    .then(() => {
      mongoose.connect('mongodb://example.com/TestingDB', (err) => {
        if (err) done(err);
        done();
      });
    });
  });

  it('should add latitude and longitude to hotHealLocations', function (done) {
    const hotMealTestData = {
      day_time:'Fridays: 11:30 A.M. - 12:30 P.M.',
      location:'5710 22nd Ave. NW  Seattle',
      meal_served:'Lunch',
      name_of_program:'Saint Luke\'s Episcopal Church',
      people_served:'OPEN TO ALL'
    };
    HotMealLocation.create(hotMealTestData, (err, hotMeal) => {
      if (err) done(err);
      addLatLngFromGoogle(null, hotMeal);
      setTimeout(() => {
        HotMealLocation.findById(hotMeal._id, (err, updatedHotMeal) => {
          if (err) done(err);
          expect(updatedHotMeal.day_time).to.equal(hotMealTestData.day_time);
          expect(updatedHotMeal.latitude).to.equal(googleData.results[0].geometry.location.lat);
          expect(updatedHotMeal.longitude).to.equal(googleData.results[0].geometry.location.lng);
          done();
        });
      }, 1000);
    });
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
