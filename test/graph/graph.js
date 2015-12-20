'use strict';

const chai = require('chai');
const expect = chai.expect;

const graph = require('../../src/graph/graph');
const vertex = require('../../src/graph/vertex');
const arc = require('../../src/graph/arc');

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

  });

});
