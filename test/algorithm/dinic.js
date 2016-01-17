'use strict';

const chai = require('chai');
const expect = chai.expect;

const dinic = require('../../src/js/algorithm/dinic');
const generator = require('../../src/js/graph/generator');

describe('Dinic', () => {

  describe('#init', () => {

    it('should take a generated graph as an input', () => {
      let g = generator.create(10, 100).run();
      let iterator = dinic.init(g);

      expect(iterator.next).to.be.a('function');
      expect(iterator.value).to.be.undefined;
    });

    it('should return a generator', () => {
      let g = generator.create(10, 100).run();
      let iterator = dinic.init(g);

      expect(iterator.next).to.be.a('function');
      expect(iterator.value).to.be.undefined;
    });

    it('the iterator should yield an output object', () => {
      let g = generator.create(10, 100).run();
      let iterator = dinic.init(g);
      let result = iterator.next();

      expect(result.value).to.be.an('object');
      expect(result.value).to.have.property('levelGraph').that.is.an('object');
      expect(result.value).to.have.property('blockingFlow').that.is.an('object');
      expect(result.value).to.have.property('logger').that.is.an('object');

    });

  });

  describe('#run', () => {

    it('should return a flow', () => {
      let g = generator.create(10, 100).run();
      let iterator = dinic.init(g);
      let output = dinic.run(iterator);

      expect(output).to.be.an('object');
      expect(output).to.have.property('levelGraph').that.is.an('object');
      expect(output).to.have.property('blockingFlow').that.is.an('object');
      expect(output).to.have.property('logger').that.is.an('object');
    });

  });

});
