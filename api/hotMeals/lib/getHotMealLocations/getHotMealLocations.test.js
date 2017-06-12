'use strict';

const mongoose = require('mongoose');

mongoose.Promise = Promise;

const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const expect = require('chai').expect;
const nock = require('nock');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const HotMealLocation = require('../../models/HotMealLocation');
const socrataData = JSON.stringify(require('./getHotMealLocationsTestData.json'));
const getHotMealLocations = require('./getHotMealLocations');

describe('getHotMealLocations', function() {
  //extend timeout for mockgoose
  this.timeout(120000);
  // prevent contamination of environment variables
  let env;
  const testUrl = 'http://example.com';

  before(function(done) {
    env = process.env;
    process.env.SOCRATA_DATA_API_KEY = 'fakeApiKey';

    // nock successful request to Socrata
    nock(testUrl, {
      reqheaders: {
        'X-App-Token': process.env.SOCRATA_DATA_API_KEY,
        'Accept': 'application/json'
      }
    })
      .get('/')
      .times(1)
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

    getHotMealLocations(testUrl, addLatLngSpy);

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

  before(function(done) {

    // nock error on request to Socrata
    nock(testUrl, {
      reqheaders: {
        'X-App-Token': process.env.SOCRATA_DATA_API_KEY,
        'Accept': 'application/json'
      }
    })
      .get('/')
      .times(1)
      .replyWithError({ 'message': 'something awful happened' });

    done();

  });

  it('should call the callback with the error when an error is returned from Socrata', function (done) {
    const addLatLngSpy = sinon.spy();

    getHotMealLocations(testUrl, addLatLngSpy);
    setTimeout(() => {
      expect(addLatLngSpy.called).to.equal(true);
      expect(addLatLngSpy.calledWith(sinon.match({ message: 'something awful happened' }))).to.equal(true);
      done();
    }, 1000);

  });

  before(function (done) {
    // nock successful request to Socrata
    nock(testUrl, {
      reqheaders: {
        'X-App-Token': process.env.SOCRATA_DATA_API_KEY,
        'Accept': 'application/json'
      }
    })
      .get('/')
      .times(1)
      .reply(200, socrataData);

    done();

  });

  it('should call the callback with the error when mongoose returns an error', function (done) {
    const addLatLngSpy = sinon.spy();

    const HotMealLocationStub = {
      findOneAndUpdate: (query, obj, options, callback) => {
        return callback(new Error('out of beer'));
      }
    };
    // eslint-disable-next-line prefer-const
    let getHotMealLocations = proxyquire('./getHotMealLocations', { '../../models/HotMealLocation': HotMealLocationStub });

    getHotMealLocations(testUrl, addLatLngSpy);
    setTimeout(() => {
      expect(addLatLngSpy.called).to.equal(true);
      expect(addLatLngSpy.calledWith(sinon.match({ message: 'out of beer' }))).to.equal(true);

      done();

    }, 1000);

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
