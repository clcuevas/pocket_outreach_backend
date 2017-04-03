'use strict';

const expect = require('chai').expect;

const getFoodBank = require('../getFoodBank');

describe('getFoodBank', () => {
  it('should be a function', (done) => {
    expect(getFoodBank).to.be.a('function');
    done();
  });

  it('should interpret a query string', (done) => {
    const urlStr = 'http://example.com/?long=value&lat=value2';
    const req = {
      query: {
        latitude: 'someLatitude',
        longitude: 'someLongitude',
        time: '1491179493355'
      }
    };
    const res = {};

    getFoodBank(req, res, () => {
      expect(req.query.latitude).to.equal('someLatitude');
      expect(req.query.longitude).to.equal('someLongitude');
      expect(req.query.time).to.equal('1491179493355');
      done();
    });
  });
});
