'use strict';

const chai = require('chai');
const expect = chai.expect;

const env = require('../../src/js/testenv/env');
const log = require('../../src/js/util/log');

describe('Test Environment', () => {

  it('should export a function', () => {
    expect(env).to.be.a('function');
  });

  it('should export a function that returns an array of loggers', (done) => {
    let instances = 5;
    let algorithms = 4;

    let result = env(instances, 100, 100);

    expect(result).to.be.an('array');
    expect(result).to.have.length(instances);
    result.forEach((instanceResult) => {
      expect(instanceResult).to.be.an('array');
      expect(instanceResult).to.have.length(algorithms + 1);
      instanceResult.forEach((algorithmResult) => {
        expect(algorithmResult).to.be.instanceOf(log.Logger);
      });
    });

    done();
  });

});
