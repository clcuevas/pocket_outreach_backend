'use strict';

const FoodBank = require('../../models/FoodBank');

function saveCentralEastNCFoodBanks(foodBanks, errorHandlerCallback) {

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
      error => {
        if (error) return errorHandlerCallback(error);
      }
    );
  }

}

module.exports = exports = saveCentralEastNCFoodBanks;
