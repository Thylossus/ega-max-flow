'use strict';

const chai = require('chai');
const expect = chai.expect;

const graphTraversal = require('../../src/js/algorithm/graphTraversal');
const generator = require('../../src/js/graph/generator');
const stack = require('../../src/js/structure/stack');
const queue = require('../../src/js/structure/queue');
const graph = require('../../src/js/graph/graph');
const vertex = require('../../src/js/graph/vertex');
const arc = require('../../src/js/graph/arc');

describe('Graph Traversal', () => {

  describe('#init', () => {

    it('should work with stack', () => {
      let g = generator.create(10, 100).run();
      let s = stack.create();
      let init = graphTraversal.init.bind(null, s, g);

      expect(init).not.to.throw(Error);
    });

    it('should work with queue', () => {
      let g = generator.create(10, 100).run();
      let q = queue.create();
      let init = graphTraversal.init.bind(null, q, g);

      expect(init).not.to.throw(Error);
    });

    it('should not work with any other data structure than queue or stack', () => {
      let g = generator.create(10, 100).run();
      let init = graphTraversal.init.bind(null, [], g);

      expect(init).to.throw(Error);
      expect(init).to.throw(/queue or stack/);
    });

    it('should return a generator', () => {
      let g = generator.create(10, 100).run();
      let q = queue.create();
      let traverse = graphTraversal.init(q, g);

      expect(traverse.next).to.be.a('function');
    });

    it('should be "curryable"', () => {
      let s = stack.create();
      let q = queue.create();
      let dfs = graphTraversal.init(s);
      let bfs = graphTraversal.init(q);

      expect(dfs).to.be.a('function');
      expect(bfs).to.be.a('function');
    });

    it('the returned generator should provide an output object', () => {
      let g = generator.create(10, 100).run();
      let q = queue.create();
      let traverse = graphTraversal.init(q, g);
      let output = traverse.next().value;

      expect(output).to.have.property('lexicographical').that.is.an('array');
      expect(output).to.have.property('parenthetical').that.is.an('array');
      expect(output).to.have.property('arcs').that.is.an('array');
      expect(output).to.have.property('minCapacity').that.is.a('number');
      expect(output).to.have.property('currentArc');
      expect(output).to.have.property('currentVertex').that.is.an('object');
      expect(output).to.have.property('progress').that.is.a('boolean');
    });

    it('should take the start vertex as an input argument', () => {
      let g = generator.create(10, 100).run();
      let q = queue.create();
      let traverse = graphTraversal.init(q, g, g.sink);

      let output = traverse.next().value;

      expect(output.currentVertex.equals(g.sink)).to.be.true;
    });

  });

  describe('#run', () => {
    it('should provide an output object', () => {
      let g = generator.create(10, 100).run();
      let q = queue.create();
      let traverse = graphTraversal.init(q, g);
      let output = graphTraversal.run(traverse);

      expect(output).to.have.property('lexicographical').that.is.an('array');
      expect(output).to.have.property('parenthetical').that.is.an('array');
      expect(output).to.have.property('arcs').that.is.an('array');
      expect(output).to.have.property('minCapacity').that.is.an('number');
      expect(output).to.have.property('currentArc');
      expect(output).to.have.property('currentVertex').that.is.an('object');
      expect(output).to.have.property('progress').that.is.a('boolean');
    });

    it('should contain all connected vertices for DFS', () => {
      let v1 = vertex.create();
      let v2 = vertex.create();
      let v3 = vertex.create();
      let a1 = arc.create(v1, v2, 1);
      let a2 = arc.create(v2, v3, 1);
      let a3 = arc.create(v3, v2, 1);
      let a4 = arc.create(v2, v1, 1);

      v1.outgoingArcs = [a1];
      v2.outgoingArcs = [a2, a4];
      v3.outgoingArcs = [a3];

      let vertices = [v1, v2, v3];
      let arcs = [a1, a2, a3, a4];

      let g = graph.create(vertices, arcs);
      g.source = v1;
      g.sink = v3;

      let s = stack.create();
      let traverse = graphTraversal.init(s, g);
      let output = graphTraversal.run(traverse);

      expect(output.lexicographical).to.include(v1);
      expect(output.parenthetical).to.include(v1);
      expect(output.lexicographical).to.include(v2);
      expect(output.parenthetical).to.include(v2);
      expect(output.lexicographical).to.include(v3);
      expect(output.parenthetical).to.include(v3);
    });

    it('should contain all connected vertices for BFS', () => {
      let v1 = vertex.create();
      let v2 = vertex.create();
      let v3 = vertex.create();
      let a1 = arc.create(v1, v2, 1);
      let a2 = arc.create(v2, v3, 1);
      let a3 = arc.create(v3, v2, 1);
      let a4 = arc.create(v2, v1, 1);

      v1.outgoingArcs = [a1];
      v2.outgoingArcs = [a2, a4];
      v3.outgoingArcs = [a3];

      let vertices = [v1, v2, v3];
      let arcs = [a1, a2, a3, a4];

      let g = graph.create(vertices, arcs);
      g.source = v1;
      g.sink = v3;

      let q = queue.create();
      let traverse = graphTraversal.init(q, g);
      let output = graphTraversal.run(traverse);

      expect(output.lexicographical).to.include(v1);
      expect(output.parenthetical).to.include(v1);
      expect(output.lexicographical).to.include(v2);
      expect(output.parenthetical).to.include(v2);
      expect(output.lexicographical).to.include(v3);
      expect(output.parenthetical).to.include(v3);
    });

    it('should return the correct minimum capacity', () => {
      let minCapacity = 1;
      let source = vertex.create();
      let v1 = vertex.create();
      let v2 = vertex.create();
      let v3 = vertex.create();
      let sink = vertex.create();
      let a1 = arc.create(source, v1, minCapacity);
      let a2 = arc.create(v1, v2, minCapacity);
      let a3 = arc.create(v1, v3, minCapacity);
      let a4 = arc.create(v2, sink, minCapacity);
      let a5 = arc.create(v3, sink, minCapacity);
      let a6 = arc.create(sink, v3, minCapacity);
      let a7 = arc.create(sink, v2, minCapacity);
      let a8 = arc.create(v3, v1, minCapacity);
      let a9 = arc.create(v2, v1, minCapacity);
      let a10 = arc.create(v1, source, minCapacity);

      source.outgoingArcs = [a1];
      v1.outgoingArcs = [a2, a3];
      v2.outgoingArcs = [a4, a9];
      v3.outgoingArcs = [a5, a8];
      sink.outgoingArcs = [a6, a7];

      let vertices = [source, v1, v2, v3, sink];
      let arcs = [a1, a2, a3, a4, a5, a6, a7, a8, a9, a10];

      let g = graph.create(vertices, arcs);
      g.source = source;
      g.sink = sink;

      let q = queue.create();
      let traverse = graphTraversal.init(q, g);
      let output = graphTraversal.run(traverse);

      expect(output.minCapacity).to.equal(minCapacity);
    });

    it('should ignore arcs with no capacity', () => {
      let source = vertex.create();
      let v1 = vertex.create();
      let v2 = vertex.create();
      let v3 = vertex.create();
      let sink = vertex.create();
      let a1 = arc.create(source, v1, 1);
      let a2 = arc.create(v1, v2, 1);
      let a3 = arc.create(v1, v3, 1);
      let a4 = arc.create(v2, sink, 0);
      let a5 = arc.create(v3, sink, 0);
      let a6 = arc.create(sink, v3, 1);
      let a7 = arc.create(sink, v2, 1);
      let a8 = arc.create(v3, v1, 1);
      let a9 = arc.create(v2, v1, 1);
      let a10 = arc.create(v1, source, 1);

      source.outgoingArcs = [a1];
      v1.outgoingArcs = [a2, a3];
      v2.outgoingArcs = [a4, a9];
      v3.outgoingArcs = [a5, a8];
      sink.outgoingArcs = [a6, a7];

      let vertices = [source, v1, v2, v3, sink];
      let arcs = [a1, a2, a3, a4, a5, a6, a7, a8, a9, a10];

      let g = graph.create(vertices, arcs);
      g.source = source;
      g.sink = sink;

      let q = queue.create();
      let traverse = graphTraversal.init(q, g);
      let output = graphTraversal.run(traverse);

      expect(output.lexicographical).not.to.include(sink);
      expect(output.parenthetical).not.to.include(sink);
    });

    it('should accept a termination vertex', () => {
      let g = generator.create(10, 100).run();
      let q = queue.create();
      let traverse = graphTraversal.init(q, g);
      let output = graphTraversal.run(traverse, g.sink);

      expect(output).to.have.property('lexicographical').that.is.an('array');
      expect(output).to.have.property('parenthetical').that.is.an('array');
      expect(output).to.have.property('minCapacity').that.is.an('number');
    });

    it('should have the termination vertex as the last vertex in the lexicographical output', () => {
      let g = generator.create(10, 100).run();
      let q = queue.create();
      let traverse = graphTraversal.init(q, g);
      let output = graphTraversal.run(traverse, g.sink);

      expect(output.lexicographical[output.lexicographical.length - 1]).to.equal(g.sink);
      expect(output.arcs[output.arcs.length - 1].to).to.equal(g.sink);
    });

    it('should terminate early', () => {
      let v1 = vertex.create();
      let v2 = vertex.create();
      let v3 = vertex.create();
      let a1 = arc.create(v1, v2, 1);
      let a2 = arc.create(v2, v3, 1);
      let a3 = arc.create(v3, v2, 1);
      let a4 = arc.create(v2, v1, 1);

      v1.outgoingArcs = [a1];
      v2.outgoingArcs = [a2, a4];
      v3.outgoingArcs = [a3];

      let vertices = [v1, v2, v3];
      let arcs = [a1, a2, a3, a4];

      let g = graph.create(vertices, arcs);
      g.source = v1;
      g.sink = v3;

      let s = stack.create();
      let traverse = graphTraversal.init(s, g);
      let output = graphTraversal.run(traverse, v2);

      expect(output.lexicographical).to.include(v1);
      expect(output.lexicographical).to.include(v2);
      expect(output.lexicographical).not.to.include(v3);
    });

    it('should terminate early and have only the path min capacity as its output min capacity', () => {
      let source = vertex.create();
      source.id = 'source';
      let sink = vertex.create();
      sink.id = 'sink';
      let v1 = vertex.create();
      v1.id = 'v1';
      let v2 = vertex.create();
      v2.id = 'v2';
      let v3 = vertex.create();
      v3.id = 'v3';
      let v4 = vertex.create();
      v4.id = 'v4';
      let v5 = vertex.create();
      v5.id = 'v5';
      let v6 = vertex.create();
      v6.id = 'v6';

      let a1 =  arc.create(source, v1,     1);
      let a2 =  arc.create(v1,     source, 1);
      let a3 =  arc.create(v1,     v2,     1);
      let a4 =  arc.create(v2,     v1,     1);
      let a5 =  arc.create(v2,     v3,     1);
      let a6 =  arc.create(v3,     v2,     1);

      let a7 =  arc.create(source, v4,     2);
      let a8 =  arc.create(v4,     source, 3);
      let a9 =  arc.create(v4,     v5,     4);
      let a10 = arc.create(v5,     v4,     5);
      let a11 = arc.create(v5,     v6,     2);
      let a12 = arc.create(v6,     v5,     3);
      let a13 = arc.create(v6,     sink,   4);
      let a14 = arc.create(sink,   v6,     5);

      source.outgoingArcs = [a1, a7];
      v1.outgoingArcs = [a3, a2];
      v2.outgoingArcs = [a5, a4];
      v3.outgoingArcs = [a6];
      v4.outgoingArcs = [a9, a8];
      v5.outgoingArcs = [a11, a10];
      v6.outgoingArcs = [a13, a12];
      sink.outgoingArcs = [a14];

      let vertices = [source, v1, v2, v3, v4, v5, v6, sink];
      let arcs = [a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14];

      let g = graph.create(vertices, arcs);
      g.source = source;
      g.sink = sink;

      let s = stack.create();
      let traverse = graphTraversal.init(s, g);
      let output = graphTraversal.run(traverse, sink);

      expect(output.minCapacity).to.equal(2);
    });

  });

});
