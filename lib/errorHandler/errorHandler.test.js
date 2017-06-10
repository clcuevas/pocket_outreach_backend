'use strict';

const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('errorHandler', function () {
  let env;

  before(function (done) {
    // prevent contamination of environment variables
    env = process.env;
    done();
  });

  it('should send error to winston when NODE_ENV !== \'production\'', function (done) {
    process.env.NODE_ENV = 'development';
    const testError = new Error('oh no, what happened?');
    const errorStub = sinon.stub();

    //noinspection JSUnusedLocalSymbols
    const winstonStub = {
      Logger: class {
        //noinspection JSUnusedGlobalSymbols
        constructor(){
          this.error = errorStub;
        }
      }
    };
    // eslint-disable-next-line prefer-const
    let errorHandler = proxyquire('./errorHandler', { 'winston': winstonStub });

    errorHandler(testError);
    expect(errorStub.calledWith(testError)).to.equal(true);
    done();

  });

  it('should send error to winston when NODE_ENV === \'production\'', function (done) {
    process.env.NODE_ENV = 'production';
    const testError = new Error('test error');
    const errorStub = sinon.stub();

    //noinspection JSUnusedLocalSymbols
    const winstonStub = {
      Logger: class {
        //noinspection JSUnusedGlobalSymbols
        constructor(){
          this.error = errorStub;
        }
      }
    };
    // eslint-disable-next-line prefer-const
    let errorHandler = proxyquire('./errorHandler', { 'winston': winstonStub });

    errorHandler(testError);
    expect(errorStub.calledWith(testError)).to.equal(true);
    done();

  });

  after( (done) => {
    process.env = env;
    done();
  });

});
