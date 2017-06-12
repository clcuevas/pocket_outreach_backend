'use strict';
/**
 * @module getFoodBank
 */

const request = require('superagent');
const FoodBank = require('../../models/FoodBank');

/**
 * @function getCentralEastNCFoodBanks
 * @param {string} url - the url that points to a Socrata API resource with food bank data in JSON format
 * @param {function} callback - the error handler callback
 */

function getCentralEastNCFoodBanks(url, callback) {

  // call the API and get the food banks
  request
    .get(url)
    .set({ 'X-App-Token': process.env.SOCRATA_DATA_API_KEY, 'Accept': 'application/json' })
    .end((err, response) => {
      if (err) callback(err);

      const foodBanks = JSON.parse(response.text);

      for (const foodBank of foodBanks) {
        const extractedFoodBank = {
          address: `${foodBank.location_1_location}, ${foodBank.location_1_state}, ${foodBank.zipcode}`,
          common_name: foodBank.name,
          longitude: foodBank.location_1.coordinates[0],
          latitude: foodBank.location_1.coordinates[1],
          location: {
            location_type: foodBank.location_1.type,
            coordinates: foodBank.location_1.coordinates
          },
          city_feature: foodBank.type,
          website: foodBank._pageurl,
          hours: foodBank.hours
        };

        FoodBank.findOneAndUpdate(
          { common_name: extractedFoodBank.common_name },
          extractedFoodBank,
          { returnNewDocument: true, upsert: true, new: true },
          (err) => {
            if (err) callback(err);
          }
        );
      }
    });
}

module.exports = exports = getCentralEastNCFoodBanks;
