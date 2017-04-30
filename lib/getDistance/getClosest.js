'use strict';

/**
 * @module getDistanceFromLatLon
 */


/**
 * use haversine formula to calculate
 * @param lat1 {number | string} - first latitude in signed degree format to compare
 * @param lon1 {number | string} - first longitude in signed degree format to compare
 * @param lat2 {number | string} - second latitude in signed degree format to compare
 * @param lon2 {number | string} - second longitude in signed degree format to compare
 * @returns {number} - the great-circle distance between the first latitude and longitude pair and the second latitude and longitude pair
 */

function getDistanceFromLatLon(lat1,lon1,lat2,lon2) {
  if (!lat1 || !lat2 || !lon1 || !lon2) {
    return NaN;
  }
  const R = 3958.7613; // Radius of the earth in miles
  const dLat = deg2rad(lat2-lat1);  // deg2rad below
  const dLon = deg2rad(lon2-lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in miles
}

/**
 * @param deg {number} - the degree value to be converted to radius
 * @returns {number} - the deg value converted to radius
 */
function deg2rad(deg) {
  return deg * (Math.PI/180);
}

module.exports = exports = getDistanceFromLatLon;
