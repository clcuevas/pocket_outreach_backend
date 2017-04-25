'use strict';
const expect = require('chai').expect;

const getClosestHotMeal = require('../getClosestHotMeal');

describe('getClosestHotMeal', () => {

  describe('get', () => {

    it('should return the nearest open venue with a hot meal', (done) => {
      const req = {
        query: {
          latitude: '47.673554',
          longitude: '-122.387062'
        }
      };

      getClosestHotMeal.get(req, {}, (err) => {
        if (err) done(err);
        done();
      });
    });

    it('should return a 400 status and missing query message when no latitude is provided', (done) => {
      const req = {
        query: {
          longitude: '-122.387062'
        }
      };

      getClosestHotMeal.get(req, {}, (err) => {
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

      getClosestHotMeal.get(req, {}, (err) => {
        if (err) done(err);
        expect(req.returnVal.data.error).to.equal('Invalid or missing query string');
        expect(req.returnVal.status).to.equal(400);
        done();
      });

    });
  });
});
