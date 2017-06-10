'use strict';

const path = require('path');
const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('serveJsDocs', function () {
  const apiDocIndex = path.join(__dirname, '../..', 'out', 'index.html');

  it('should serve a file if it exists', function (done) {
    const resStub = {
      status: sinon.spy(),
      sendFile: (path) => {
        expect(resStub.status.calledWith(200)).to.equal(true);
        expect(path).to.equal(apiDocIndex);
        done();
      }
    };

    const fsStub = {
      existsSync: () => {
        return true;
      }
    };

    const serveJsDocs = proxyquire('./serveJsDocs', { 'fs': fsStub });

    serveJsDocs({}, resStub);

  });

  it('should send 404 and error if file doesn\'t exist', function (done) {
    const resStub = {
      status: sinon.spy(),
      json: sinon.spy()
    };

    const fsStub = {
      existsSync: () => {
        return false;
      }
    };

    const err = {
      errors: [ {
        error: 'not found',
        status: 404
      } ]
    };

    const serveJsDocs = proxyquire('./serveJsDocs', { 'fs': fsStub });

    serveJsDocs({}, resStub);
    expect(resStub.status.calledWith(404)).to.equal(true);
    expect(resStub.json.calledWith(err)).to.equal(true);
    done();
  });

});
