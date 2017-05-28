'use strict';

function extractCentralEastNCFoodBanks(foodBank, saveFoodBankCallback) {
  let extractedFoodBank;
  if (foodBank) {
    extractedFoodBank = {
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
  } else {
    saveFoodBankCallback(new Error(`cannot extract Eastern North Carolina food bank from ${foodBank}`));
  }

  saveFoodBankCallback(null, extractedFoodBank);
}

module.exports = exports = extractCentralEastNCFoodBanks;
