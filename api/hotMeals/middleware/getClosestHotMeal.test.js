'use strict';
const expect = require('chai').expect;
const mongoose = require('mongoose');

mongoose.Promise = Promise;

const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);

const getClosestHotMeal = require('./getClosestHotMeal');
const HotMealLocation = require('../models/HotMealLocation');
const getClosestHotMealTestData = require('./getClosestHotMealTestData.json');

describe('getClosestHotMeal', () => {


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

  it('should return the nearest 3 open venues with a hot meal when no number is specified', (done) => {
    const req = {
      query: {
        latitude: '47.6795200',
        longitude: '-122.3875480'
      }
    };
    const promises = [];
    for (const location of getClosestHotMealTestData) {
      const hotMealLocation = new HotMealLocation(location);
      promises.push(hotMealLocation.save());
    }

    Promise.all(promises)
    .then(hotMealLocations => {
      getClosestHotMeal(req, {}, (err) => {
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
  });

  it('should return a 400 status and missing query message when no latitude is provided', (done) => {
    const req = {
      query: {
        longitude: '-122.387062'
      }
    };

    getClosestHotMeal(req, {}, (err) => {
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

    getClosestHotMeal(req, {}, (err) => {
      if (err) done(err);
      expect(req.returnVal.data.error).to.equal('Invalid or missing query string');
      expect(req.returnVal.status).to.equal(400);
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
