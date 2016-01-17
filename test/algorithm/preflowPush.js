'use strict';

const chai = require('chai');
const expect = chai.expect;

const preflowPush = require('../../src/js/algorithm/preflowPush');
const generator = require('../../src/js/graph/generator');

describe('Preflow Push', () => {

  describe('#init', () => {

    it('should take a generated graph as an input', () => {
      let g = generator.create(10, 100).run();
      let iterator = preflowPush.init(g);

      expect(iterator.next).to.be.a('function');
      expect(iterator.value).to.be.undefined;
    });

    it('should return a generator', () => {
      let g = generator.create(10, 100).run();
      let iterator = preflowPush.init(g);

      expect(iterator.next).to.be.a('function');
      expect(iterator.value).to.be.undefined;
    });

    it('the iterator should yield an output object', () => {
      let g = generator.create(10, 100).run();
      let iterator = preflowPush.init(g);
      let result = iterator.next();

      expect(result.value).to.be.an('object');
      expect(result.value).to.have.property('preflow').that.is.an('array');
      expect(result.value).to.have.property('logger').that.is.an('object');
      expect(result.value).to.have.property('step').that.is.a('string');
      expect(result.value).to.have.property('activeElement').that.is.null;
    });

  });

  describe('#run', () => {

    it('should return a flow', () => {
      let g = generator.create(10, 100).run();
      let iterator = preflowPush.init(g);
      let output = preflowPush.run(iterator);

      expect(output).to.be.an('object');
      expect(output).to.have.property('flow').that.is.an('object');
    });

  });

});
