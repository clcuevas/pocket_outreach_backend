'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('expressErrorHandler', function () {
  let env;

  before(function (done) {
    // prevent contamination of environment variables
    env = process.env;
    done();
  });

  it('should send error to winston and return correct status when NODE_ENV !== \'production\'', function (done) {
    process.env.NODE_ENV = 'development';
    const testError = new Error('test error');
    testError.status = 420;
    const errorHandlerStub = sinon.spy();
    const nextSpy = sinon.spy();
    // eslint-disable-next-line prefer-const
    let expressErrorHandler = proxyquire('./expressErrorHandler', { '../errorHandler/errorHandler': errorHandlerStub });
    const res = {
      status: sinon.spy(),
      json: sinon.spy()
    };

    expressErrorHandler(testError, {}, res, nextSpy);
    expect(errorHandlerStub.calledWith(testError)).to.equal(true);
    expect(res.status.calledWith(420)).to.equal(true);
    expect(res.json.called).to.equal(true);
    expect(res.json.calledWith(sinon.match({ error: 'test error' }))).to.equal(true);
    done();

  });

  it('should send error to winston and return correct status when NODE_ENV === \'production\'', function (done) {
    process.env.NODE_ENV = 'production';
    const testError = new Error('test error');
    testError.status = 420;
    const errorHandlerStub = sinon.spy();
    const nextSpy = sinon.spy();
    // eslint-disable-next-line prefer-const
    let expressErrorHandler = proxyquire('./expressErrorHandler', { '../errorHandler/errorHandler': errorHandlerStub });
    const res = {
      status: sinon.spy(),
      json: sinon.spy()
    };

    expressErrorHandler(testError, {}, res, nextSpy);
    expect(res.status.calledWith(420)).to.equal(true);
    expect(res.json.called).to.equal(true);
    expect(res.json.calledWith(sinon.match({ error: 'Something broke' }))).to.equal(true);
    done();

  });

  after( (done) => {
    process.env = env;
    done();
  });

});
