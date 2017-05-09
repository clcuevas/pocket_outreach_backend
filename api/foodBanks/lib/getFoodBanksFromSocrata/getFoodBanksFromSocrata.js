'use strict';
/**
 * @module getFoodBank
 */

const request = require('superagent');
const FoodBank = require('../../models/FoodBank');

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
        const newFoodBank = new FoodBank(foodBank);

        newFoodBank.location.location_type = foodBank.location.type;

        newFoodBank.save()
        .catch(error => {
          callback(error);
        });
      }
    }
  });
}

module.exports = exports = getFoodBanksFromSocrata;
