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
    });

  });

  describe('#run', () => {

  });

});
