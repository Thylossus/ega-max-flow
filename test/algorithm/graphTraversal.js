'use strict';

const chai = require('chai');
const expect = chai.expect;

const graphTraversal = require('../../src/js/algorithm/graphTraversal');
const generator = require('../../src/js/graph/generator');
const stack = require('../../src/js/algorithm/stack');
const queue = require('../../src/js/algorithm/queue');

describe('Graph Traversal', () => {

  describe('#init', () => {

    it('should work with stack', () => {
      let graph = generator.create(10, 100).run();
      let s = stack.create();
      let init = graphTraversal.init.bind(null, graph, s);

      expect(init).not.to.throw(Error);
    });

    it('should work with queue', () => {
      let graph = generator.create(10, 100).run();
      let q = queue.create();
      let init = graphTraversal.init.bind(null, graph, q);

      expect(init).not.to.throw(Error);
    });

    it('should not work with any other data structure than queue or stack', () => {
      let graph = generator.create(10, 100).run();
      let init = graphTraversal.init.bind(null, graph, []);

      expect(init).to.throw(Error);
      expect(init).to.throw(/queue or stack/);
    });

    it('should return a generator', () => {
      let graph = generator.create(10, 100).run();
      let q = queue.create();
      let traverse = graphTraversal.init(graph, q);

      expect(traverse.next).to.be.a('function');
    });

    it('the returned generator should provide an output object', () => {
      let graph = generator.create(10, 100).run();
      let q = queue.create();
      let traverse = graphTraversal.init(graph, q);
      let output = traverse.next().value;

      expect(output).to.have.property('aborescence').that.is.an('object');
      expect(output).to.have.property('lexicographical').that.is.an('array');
      expect(output).to.have.property('parenthetical').that.is.an('array');
    });

  });

  describe('#run', () => {
    it('tshould provide an output object', () => {
      let graph = generator.create(10, 100).run();
      let q = queue.create();
      let traverse = graphTraversal.init(graph, q);
      let output = graphTraversal.run(traverse);

      expect(output).to.have.property('aborescence').that.is.an('object');
      expect(output).to.have.property('lexicographical').that.is.an('array');
      expect(output).to.have.property('parenthetical').that.is.an('array');
    });
  });

});
