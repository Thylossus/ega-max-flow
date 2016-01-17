'use strict';

const chai = require('chai');
const expect = chai.expect;

const edmondsKarp = require('../../src/js/algorithm/edmondsKarp');
const generator = require('../../src/js/graph/generator');

describe('Edmonds Karp', () => {

  describe('#init', () => {

    it('should take a generated graph as an input', () => {
      let g = generator.create(10, 100).run();
      let iterator = edmondsKarp.init(g);

      expect(iterator.next).to.be.a('function');
      expect(iterator.value).to.be.undefined;
    });

    it('should return a generator', () => {
      let g = generator.create(10, 100).run();
      let iterator = edmondsKarp.init(g);

      expect(iterator.next).to.be.a('function');
      expect(iterator.value).to.be.undefined;
    });

    it('the iterator should yield an output object', () => {
      let g = generator.create(10, 100).run();
      let iterator = edmondsKarp.init(g);
      let result = iterator.next();

      expect(result.value).to.be.an('object');
      expect(result.value).to.have.property('flowAugmentingPath').that.is.an('array');
      expect(result.value).to.have.property('flow').that.is.an('object');
      expect(result.value).to.have.property('logger').that.is.an('object');
    });

  });

  describe('#run', () => {

    it('should return a flow', () => {
      let g = generator.create(10, 100).run();
      let iterator = edmondsKarp.init(g);
      let output = edmondsKarp.run(iterator);

      expect(output).to.be.an('object');
      expect(output).to.have.property('flowAugmentingPath').that.is.an('array');
      expect(output).to.have.property('flow').that.is.an('object');
      expect(output).to.have.property('logger').that.is.an('object');
    });

  });

});
