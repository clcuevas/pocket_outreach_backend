'use strict';

const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
mongoose.Promise = Promise;
const expect = require('chai').expect;
const nock = require('nock');
const sinon = require('sinon');
const HotMealLocation = require('../../models/HotMealLocation');
const socrataData = JSON.stringify(require('./hotMealTestData.json'));
const getHotMealLocations = require('../getHotMealLocations');

describe('getHotMealLocations', function() {
  //extend timeout for mockgoose
  this.timeout(120000);
  // prevent contamination of environment variables
  let env;

  before(function(done) {
    env = process.env;
    // create test environment variables
    process.env.SEATTLE_HOT_MEAL_RESOURCE = 'fake-data.json';
    process.env.SEATTLE_DATA_BASE_PATH = 'resource';
    process.env.SEATTLE_DATA_BASE_URL = 'https://example.com';
    process.env.SEATTLE_DATA_API_KEY = 'fakeSocrataAPIKey';

    nock(process.env.SEATTLE_DATA_BASE_URL, {
      reqheaders: {
        'X-App-Token': process.env.SEATTLE_DATA_API_KEY,
        'Accept': 'application/json'
      }
    })
    .get(`/${process.env.SEATTLE_DATA_BASE_PATH}/${process.env.SEATTLE_HOT_MEAL_RESOURCE}`)
    .reply(200, socrataData);

    mockgoose.prepareStorage().then(() => {
      mongoose.connect('mongodb://example.com/TestingDB', (err) => {
        if (err) done(err);
        else done();
      });
    });
  });

  it('should get hot meal locations and call the callback on each one to get the latitude and longitude', function(done) {
    const addLatLngSpy = sinon.spy();
    getHotMealLocations(addLatLngSpy);
    setTimeout(() => {
      HotMealLocation.find((err, hotMealLocations) => {
        if (err) done(err);
        expect(hotMealLocations).to.exist;
        expect(hotMealLocations.length).to.equal(8);
        expect(addLatLngSpy.called).to.equal(true);
        expect(addLatLngSpy.calledWith(null, sinon.match({ _id: hotMealLocations[0]._id })), 'getHotMealLocations callback received invalid arguments').to.equal(true);
        expect(addLatLngSpy.callCount).to.equal(8);
        done();
      });
    }, 1000);
  });

  // restoring everything back
  after( (done) => {
    process.env = env;

    mockgoose.prepareStorage()
    .then(() => {
      mockgoose.helper.reset().then(() => {
        mongoose.connection.close(() => {
          if (!nock.isDone()) {
            nock.cleanAll();
          }
          done();
        });
      });
    });
  });
});
