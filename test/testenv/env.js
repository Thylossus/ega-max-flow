'use strict';

const chai = require('chai');
const expect = chai.expect;

const env = require('../../src/js/testenv/env');
const log = require('../../src/js/util/log');

describe('Test Environment', () => {

  it('should export a function', () => {
    expect(env).to.be.a('function');
  });

  it('should export a function that returns an array of loggers', function (done) {
    this.timeout(15000);

    let instances = 5;
    let algorithms = 4;

    let result = env(instances, 100, 100);

    expect(result).to.be.an('array');
    // + 1 for the manipulated iteration
    expect(result).to.have.length(instances + 1);
    for (let i = 0; i < instances; i++) {
      let instanceResult = result[i];

      expect(instanceResult).to.be.an('array');
      // + 1 for iteration logger
      expect(instanceResult).to.have.length(algorithms + 1);
      instanceResult.forEach((algorithmResult) => {
        expect(algorithmResult).to.be.instanceOf(log.Logger);
      });
    }

    // Expect the logger for the manipulated iteration
    expect(result[result.length - 1]).to.be.instanceOf(log.Logger);

    done();
  });

});
