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
      let init = graphTraversal.init.bind(null, s, graph);

      expect(init).not.to.throw(Error);
    });

    it('should work with queue', () => {
      let graph = generator.create(10, 100).run();
      let q = queue.create();
      let init = graphTraversal.init.bind(null, q, graph);

      expect(init).not.to.throw(Error);
    });

    it('should not work with any other data structure than queue or stack', () => {
      let graph = generator.create(10, 100).run();
      let init = graphTraversal.init.bind(null, [], graph);

      expect(init).to.throw(Error);
      expect(init).to.throw(/queue or stack/);
    });

    it('should return a generator', () => {
      let graph = generator.create(10, 100).run();
      let q = queue.create();
      let traverse = graphTraversal.init(q, graph);

      expect(traverse.next).to.be.a('function');
    });

    it('should be "curryable"', () => {
      let graph = generator.create(10, 100).run();
      let q = queue.create();
      let s = stack.create();
      let dfs = graphTraversal.init(s);
      let bfs = graphTraversal.init(q);

      expect(dfs).to.be.a('function');
      expect(bfs).to.be.a('function');
    });

    it('the returned generator should provide an output object', () => {
      let graph = generator.create(10, 100).run();
      let q = queue.create();
      let traverse = graphTraversal.init(q, graph);
      let output = traverse.next().value;

      expect(output).to.have.property('aborescence').that.is.an('object');
      expect(output).to.have.property('lexicographical').that.is.an('array');
      expect(output).to.have.property('parenthetical').that.is.an('array');
      expect(output).to.have.property('minCapacity').that.is.an('number');
    });

  });

  describe('#run', () => {
    it('should provide an output object', () => {
      let graph = generator.create(10, 100).run();
      let q = queue.create();
      let traverse = graphTraversal.init(q, graph);
      let output = graphTraversal.run(traverse);

      expect(output).to.have.property('aborescence').that.is.an('object');
      expect(output).to.have.property('lexicographical').that.is.an('array');
      expect(output).to.have.property('parenthetical').that.is.an('array');
      expect(output).to.have.property('minCapacity').that.is.an('number');
    });
  });

});
