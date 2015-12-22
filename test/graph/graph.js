'use strict';

const chai = require('chai');
const expect = chai.expect;

const graph = require('../../src/js/graph/graph');
const vertex = require('../../src/js/graph/vertex');
const arc = require('../../src/js/graph/arc');

describe('Graph', () => {

  describe('module methods', () => {
    describe('#create', () => {

      it('should instatiate default', () => {
        let g = graph.create();

        expect(g).to.be.an('object');
        expect(g).to.have.property('vertices').that.is.an.instanceof(Array);
        expect(g).to.have.property('arcs').that.is.an.instanceof(Array);
        expect(g.vertices).to.be.empty;
        expect(g.arcs).to.be.empty;

      });

      it('should instatiate with vertices and arcs', () => {
        let capacity = 1;
        let v1 = vertex.create();
        let v2 = vertex.create();
        let v3 = vertex.create();
        let a1 = arc.create(v1, v2, capacity);
        let a2 = arc.create(v2, v3, capacity);
        let a3 = arc.create(v3, v1, capacity);

        let vertices = [v1, v2, v3];
        let arcs = [a1, a2, a3];

        let g = graph.create(vertices, arcs);

        expect(g).to.be.an('object');
        expect(g).to.have.property('vertices').that.is.an.instanceof(Array);
        expect(g).to.have.property('arcs').that.is.an.instanceof(Array);
        expect(g.vertices).to.have.length(vertices.length);
        expect(g.arcs).to.have.length(arcs.length);

        g.vertices.forEach((vertex) => {
          let found = vertices.some((v) => {return v.equals(vertex);});
          expect(found).to.be.true;
        });

        g.arcs.forEach((arc) => {
          let found = arcs.some((a) => {return a.equals(arc);});
          expect(found).to.be.true;
        });

      });

    });
  });

  describe('class methods', () => {
    describe('#getFlow', () => {

      it('should retun the flow map', () => {
        let capacity = 5;
        let v1 = vertex.create();
        let v2 = vertex.create();
        let v3 = vertex.create();
        let a1 = arc.create(v1, v2, capacity);
        let a2 = arc.create(v2, v3, capacity);
        let a3 = arc.create(v3, v1, capacity);

        let vertices = [v1, v2, v3];
        let arcs = [a1, a2, a3];

        let g = graph.create(vertices, arcs);

        a1.setFlow(3);
        a2.setFlow(2);
        a3.setFlow(1);

        let flow = g.getFlow();

        expect(flow).to.be.an('object');
        expect(flow).to.have.property(a1.id).that.is.a('number');
        expect(flow).to.have.property(a2.id).that.is.a('number');
        expect(flow).to.have.property(a3.id).that.is.a('number');
        expect(flow[a1.id]).to.equal(a1.flow);
        expect(flow[a2.id]).to.equal(a2.flow);
        expect(flow[a3.id]).to.equal(a3.flow);

      });

    });

    describe('#reset', () => {

      it('should reset all flows and capacities', () => {
        let initCapacity = 5;
        let v1 = vertex.create();
        let v2 = vertex.create();
        let v3 = vertex.create();
        let a1 = arc.create(v1, v2, initCapacity);
        let a2 = arc.create(v2, v3, initCapacity);
        let a3 = arc.create(v3, v1, initCapacity);

        let vertices = [v1, v2, v3];
        let arcs = [a1, a2, a3];

        let g = graph.create(vertices, arcs);

        a1.setCapacity(100);
        a2.setCapacity(75);
        a3.setCapacity(50);
        a1.setFlow(3);
        a2.setFlow(2);
        a3.setFlow(1);

        g.reset();

        g.arcs.forEach((arc) => {
          expect(arc.flow).to.equal(0);
          expect(arc.initCapacity).to.equal(initCapacity);
          expect(arc.initCapacity).to.equal(arc.capacity);
        });

      });

      it('should return the graph', () => {
        let g = graph.create([], []);
        expect(g.reset()).to.equal(g);
      });

    });
  });

});
