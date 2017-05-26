'use strict';

const mongoose = require('mongoose');

mongoose.Promise = Promise;

const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const expect = require('chai').expect;
const nock = require('nock');
const config = require('config');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const googleLocationApi = config.get('resources.google.location_api');
const HotMealLocation = require('../../models/HotMealLocation');
const addLatLngFromGoogle = require('./addLatLngFromGoogle');
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
      .times(1)
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

  before(function (done) {

    nock(googleLocationApi)
      .get('')
      .times(1)
      .query(true)
      .replyWithError({ message: 'the sky is falling' });

    done();

  });

  it('should call the errorHandler when the Google API returns an error', function (done) {

    const hotMealTestData = {
      day_time:'Fridays: 11:30 A.M. - 12:30 P.M.',
      location:'5710 22nd Ave. NW  Seattle',
      meal_served:'Lunch',
      name_of_program:'Saint Luke\'s Episcopal Church',
      people_served:'OPEN TO ALL'
    };

    function errorHandlerSpy(err) {
      expect(err.message).to.deep.equal( 'the sky is falling' );
      done();
    }
    // eslint-disable-next-line
    let addLatLngFromGoogle = proxyquire('./addLatLngFromGoogle', { '../../../../lib/errorHandler/errorHandler': errorHandlerSpy});

    HotMealLocation.create(hotMealTestData, (err, hotMeal) => {
      if (err) done(err);

      addLatLngFromGoogle(null, hotMeal);

    });


  });

  it('should call the errorHandler when passed an error', function (done) {
    const testError = new Error('no tacos');
    const errorHandlerSpy = sinon.spy();
    // eslint-disable-next-line
    let addLatLngFromGoogle = proxyquire('./addLatLngFromGoogle', { '../../../../lib/errorHandler/errorHandler': errorHandlerSpy});

    addLatLngFromGoogle(testError);
    expect(errorHandlerSpy.calledWith(sinon.match(testError))).to.equal(true);
    done();

  });

  before(function (done) {
    nock(googleLocationApi)
      .get('')
      .times(1)
      .query(true)
      .reply(200, googleData);

    done();

  });

  it('should call the callback with the error when mongoose returns an error', function (done) {
    const testError = new Error('out of beer');
    const HotMealLocationStub = {
      findByIdAndUpdate: function (query, obj, options, callback) {
        callback(testError);
      }
    };
    function errorHandlerSpy(err) {
      expect(err).to.deep.equal( testError );
      done();
    }
    // eslint-disable-next-line
    let addLatLngFromGoogle = proxyquire('./addLatLngFromGoogle', { '../../../../lib/errorHandler/errorHandler': errorHandlerSpy, '../../models/HotMealLocation': HotMealLocationStub });

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
