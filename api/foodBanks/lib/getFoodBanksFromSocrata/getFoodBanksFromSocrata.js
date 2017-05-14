'use strict';
/**
 * @module getFoodBank
 */

const request = require('superagent');
const FoodBank = require('../../models/FoodBank');

/**
 * @function getFoodBanksFromSocrata
 * @param {string} url - the url that points to a Socrata API resource with food bank data in JSON format
 * @param {function} callback - the error handler callback
 *
 */

function getFoodBanksFromSocrata(url, callback) {

  // call the API and get the food banks
  request
  .get(url)
  .query({city_feature: 'Food Banks' })
  .set({'X-App-Token': process.env.SOCRATA_DATA_API_KEY, 'Accept': 'application/json'})
  .end((err, response) => {
    if (err) callback(err);

    const foodBanks = JSON.parse(response.text);

    for (const foodBank of foodBanks) {

      if (foodBank.location) {

        FoodBank.findOneAndUpdate(
          { common_name: foodBank.common_name },
          foodBank,
          { returnNewDocument: true, upsert: true, new: true },
          (err, newFoodBank) => {
            if (err) callback(err);
            newFoodBank.location.location_type = foodBank.location.type;
          }
        );
      }
    }
  });
}

module.exports = exports = getFoodBanksFromSocrata;
