'use strict';

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const expect = require('chai').expect;
const nock = require('nock');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const FoodBank = require('../../models/FoodBank');
const testSocrataData = JSON.stringify(require('./centralEastNCFoodBanksTestData.json'));

describe('getCentralEastNCFoodBanks', function() {
  //extend timeout for mockgoose
  this.timeout(120000);
  // prevent contamination of environment variables
  const env = process.env;
  const testUrl = 'http://example.com';
  const testUrl2 ='http://blahblah.com';
  const testError2 = new Error('something awful happened');

  before(function(done) {
    process.env.SOCRATA_DATA_API_KEY = 'fakeApiKey';
    nock(testUrl, {
      reqheaders: {
        'X-App-Token': process.env.SOCRATA_DATA_API_KEY,
        'Accept': 'application/json'
      }
    })
      .get('/')
      .times(2)
      .reply(200, testSocrataData);

    process.env.SOCRATA_DATA_API_KEY = 'fakeApiKey';
    nock(testUrl2, {
      reqheaders: {
        'X-App-Token': process.env.SOCRATA_DATA_API_KEY,
        'Accept': 'application/json'
      }
    })
      .get('/')
      .replyWithError(testError2);

    mockgoose.prepareStorage().then(() => {
      mongoose.connect('mongodb://example.com/TestingDB', (err) => {
        if (err) done(err);
        done();
      });
    });
  });

  it('should get central east NC food banks from Socrata and add them to the database', function(done) {
    const getCentralEastNCFoodBanks = require('./getCentralEastNCFoodBanks');
    const errorHandler = sinon.spy();

    getCentralEastNCFoodBanks(testUrl, errorHandler);
    setTimeout(() => {
      FoodBank.find({}, (err, foundFoodBanks) => {
        if (err) done(err);
        expect(foundFoodBanks).to.exist;
        expect(foundFoodBanks.length).to.equal(5);
        expect(foundFoodBanks[0].common_name).to.equal('Smart Choice Outreach Incorporation');
        expect(foundFoodBanks[0].address).to.equal('PO Box 222, NC, 28323');
        expect(foundFoodBanks[0].longitude).to.equal('-78.85302632599968');
        expect(foundFoodBanks[0].latitude).to.equal('35.31116387700047');
        expect(foundFoodBanks[0].location.coordinates[0]).to.deep.equal(-78.85302632599968);
        expect(foundFoodBanks[0].location.coordinates[1]).to.deep.equal(35.31116387700047);
        expect(foundFoodBanks[0].city_feature).to.equal('Type: FOODPANTRY');
        expect(foundFoodBanks[0].website).to.equal('http://content.foodbankcenc.org/about/zipcounty.asp');
        expect(foundFoodBanks[0].hours).to.equal('Hours: Every Wed 10:00-12:00pm');
        expect(errorHandler.called).to.equal(false);
        done();
      });
    }, 1000);
  });

  it('should call callback with an error if an error is returned from supergoose', function (done) {
    const getCentralEastNCFoodBank = require('./getCentralEastNCFoodBanks');

    function errorHandlerStub(error) {
      expect(error).to.deep.equal(testError2);
      done();
    }

    getCentralEastNCFoodBank(testUrl2, errorHandlerStub);

  });

  it('should call callback with an error if an error is returned from Mongo', function (done) {
    const testError = new Error('foul ball');
    const FoodBankStub = {
      findOneAndUpdate: (query, obj, options, callback) => {
        callback(testError);
      }
    };

    function errorHandlerStub(error) {
      expect(error).to.equal(testError);
    }
    // eslint-disable-next-line
    let getCentralEastNCFoodBanks = proxyquire('./getCentralEastNCFoodBanks', {'../../models/FoodBank': FoodBankStub});

    getCentralEastNCFoodBanks(testUrl, errorHandlerStub);
    done();
  });

  // restoring everything back
  after( (done) => {
    process.env = env;

    mockgoose.prepareStorage()
      .then(() => {
        mockgoose.helper.reset().then(() => {
          mongoose.connection.close((err) => {
            if (err) done(err);
            if (!nock.isDone()) {
              nock.cleanAll();
            }
            done();
          });
        });
      });
  });
});
