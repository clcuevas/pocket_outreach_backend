'use strict';

const expect = require('chai').expect;
const extractCentralEastNCFoodBanks = require('./extractCentralEastNCFoodBanks');
const eastNCFoodBankTestData = require('./getCentralEastNCFoodBanksTestData.json');

describe('extractCentralEastNCFoodBanks', function () {

  it('should extract an Eastern NC food bank and format it to match the FoodBank schema', function (done) {
    extractCentralEastNCFoodBanks(eastNCFoodBankTestData[0], (error, foodBank) => {
      if (error) done(error);
      expect(foodBank).to.exist;
      expect(foodBank).to.have.keys('address', 'city_feature', 'common_name', 'hours', 'latitude', 'longitude', 'location', 'website');
      done();
    });
  });

  it('should be called with an error if no food bank is found', function (done) {
    extractCentralEastNCFoodBanks(undefined, (error, foodBank) => {
      expect(foodBank).to.be.undefined;
      expect(error.message).to.equal('cannot extract Eastern North Carolina food bank from undefined');
      done();
    });
  });
});
