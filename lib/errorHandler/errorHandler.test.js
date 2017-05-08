'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('errorHandler', function () {
  let env;

  before(function (done) {
    // prevent contamination of environment variables
    env = process.env;
    done();
  });

  it('should send error to winston and return correct status when NODE_ENV !== \'production\'', function (done) {
    const testError = {
      message: 'test error',
      status: 420
    };
    const winstonStub = {
      error: function (error) {
        expect(error).to.deep.equal(testError);
      }
    };
    let errorHandler = proxyquire('./errorHandler', {'winston': winstonStub});
    const nextSpy = sinon.spy();
    const res = {
      status: sinon.spy(),
      json: sinon.spy()
    };

    errorHandler(testError, {}, res, nextSpy);
    expect(res.status.calledWith(420)).to.equal(true);
    expect(res.json.called).to.equal(true);
    expect(res.json.calledWith(sinon.match({ error: 'test error' }))).to.equal(true);
    done();

  });

  it('should send error to winston and return correct status when NODE_ENV === \'production\'', function (done) {
    process.env.NODE_ENV = 'production';
    const testError = {
      message: 'test error'
    };
    const winstonStub = {
      error: function (error) {
        expect(error).to.deep.equal(testError);
      }
    };
    let errorHandler = proxyquire('./errorHandler', {'winston': winstonStub});
    const nextSpy = sinon.spy();
    const res = {
      status: sinon.spy(),
      json: sinon.spy()
    };

    errorHandler(testError, {}, res, nextSpy);
    expect(res.status.calledWith(500)).to.equal(true);
    expect(res.json.called).to.equal(true);
    expect(res.json.calledWith(sinon.match({ error: 'Something broke' }))).to.equal(true);
    done();

  });

  after( (done) => {
    process.env = env;
    done();
  });

});
