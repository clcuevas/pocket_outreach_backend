'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire');

describe('errorHandler', function () {
  let env;

  before(function (done) {
    // prevent contamination of environment variables
    env = process.env;
    done();
  });

  it('should send error to winston when NODE_ENV !== \'production\'', function (done) {
    const testError = new Error('test error');
    const winstonStub = {
      configure: function (obj) {
        expect(obj).to.exist;
      },
      error: function (error) {
        expect(error).to.deep.equal(testError);
      },
      transports: {
        Console: 'tacocat',
        File: class {

          constructor(options) {
            expect(options.name).to.exist;
            expect(typeof options.name).to.equal('string');
            expect(typeof options.filename).to.equal('string');
            expect(typeof options.level).to.equal('string');
          }
        }
      },
      add: function (val) {
        expect(val).to.equal('tacocat');
      }
    };
    let errorHandler = proxyquire('./errorHandler', { 'winston': winstonStub });

    errorHandler(testError);
    done();

  });

  it('should send error to winston when NODE_ENV === \'production\'', function (done) {
    process.env.NODE_ENV = 'production';
    const testError = new Error('test error');

    const winstonStub = {
      configure: function (obj) {
        expect(obj).to.exist;
      },
      error: function (error) {
        expect(error).to.deep.equal(testError);
      },
      transports: {
        Console: 'tacocat',
        File: class {

          constructor(options) {
            expect(options.name).to.exist;
            expect(typeof options.name).to.equal('string');
            expect(typeof options.filename).to.equal('string');
            expect(typeof options.level).to.equal('string');
          }
        }
      },
      add: function (val) {
        expect(val).to.equal('tacocat');
      }
    };

    let errorHandler = proxyquire('./errorHandler', { 'winston': winstonStub });

    errorHandler(testError);
    done();

  });

  after( (done) => {
    process.env = env;
    done();
  });

});
