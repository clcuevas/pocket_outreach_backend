'use strict';
/**
 * @module getFoodBank
 */

const request = require('superagent');
const FoodBank = require('../../models/FoodBank');

/**
 * function to call Socrata API and get food banks
 * @function getFoodBanksFromSocrata
 * @param {string} url - the url that points to a Socrata API resource with food bank data in JSON format
 * @param {Function} callback - the error handler callback
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
          { returnNewDocument: true, upsert: true, new: true }
        )
        .then(newFoodBank => {
          newFoodBank.location.location_type = foodBank.location.type;
        })
        .catch(error => callback(error) );
      }
    }
  });
}

module.exports = exports = getFoodBanksFromSocrata;
