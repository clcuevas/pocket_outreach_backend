'use strict';

const expect = require('chai').expect;

const getDistanceFromLatLng = require('../getDistanceFromLatLng');

describe('getDistanceFromLatLng', function () {

  it('should get the correct distance when all values are provided', function (done) {
    const distance = getDistanceFromLatLng(47.673554, -122.387062, 47.665359, -122.319416);
    expect(distance).to.equal(3.1979568396526457);
    done();
  });

  it('should return NaN when not all argument is not included', function (done) {
    const distance = getDistanceFromLatLng(47.673554, -122.387062, 47.546769);
    expect(isNaN(distance)).to.equal(true);
    done();
  });

});
