'use strict';

const chai = require('chai');
const expect = chai.expect;

const generator = require('../../src/js/graph/generator');
const graphConfig = require('../../config/graph');

describe('Generator', () => {

  describe('module methods', () => {
    describe('#create', () => {

      it('should instantiate', () => {
        let numberOfVertices = 10;
        let maxCapacity = 100;

        let g = generator.create(numberOfVertices, maxCapacity);

        expect(g).to.be.an('object');
        expect(g).to.have.property('numberOfVertices').that.is.a('number');
        expect(g).to.have.property('maxCapacity').that.is.a('number');
        expect(g.numberOfVertices).to.equal(numberOfVertices);
        expect(g.maxCapacity).to.equal(maxCapacity);

      });

    });
  });

  describe('class methods', () => {
    describe('#run', () => {

      it('should return a graph', () => {
        let numberOfVertices = 10;
        let maxCapacity = 100;

        let gen = generator.create(numberOfVertices, maxCapacity);
        let graph = gen.run();

        expect(graph).to.be.an('object');
        expect(graph.vertices).to.have.length(numberOfVertices);
        // The minimum number of edges in a connected graph is at least n - 1
        expect(graph.arcs.length).to.be.above(numberOfVertices - 2);

        let noArcExceedsMaxCapacity = graph.arcs.every((arc) => {
          return arc.capacity <= maxCapacity;
        });

        expect(noArcExceedsMaxCapacity).to.be.true;
      });

      it('the returned graph should have a backwards arc for each arc', () => {
        let numberOfVertices = 10;
        let maxCapacity = 100;

        let gen = generator.create(numberOfVertices, maxCapacity);
        let graph = gen.run();

        let eachArcHasABackwardsArc = graph.arcs.every((a1) => {
          return graph.arcs.some((a2) => {
            return a1.from.equals(a2.to) && a1.to.equals(a2.from) && a1.reverse.equals(a2) && a2.reverse.equals(a1);
          });
        });

        expect(eachArcHasABackwardsArc).to.be.true;
      });

      it('the returned graph should have a source and a sink', () => {
        let numberOfVertices = 10;
        let maxCapacity = 100;

        let gen = generator.create(numberOfVertices, maxCapacity);
        let graph = gen.run();

        for (var i = 0; i < graph.vertices.length; i++) {
          if (i !== 0 && i !== graph.vertices.length - 1) {
            expect(graph.vertices[i].type).to.be.equal(graphConfig.VERTEX_TYPE.OTHER);
          } else if (i === 0) {
            expect(graph.vertices[i].type).to.be.equal(graphConfig.VERTEX_TYPE.SOURCE);
          } else {
            expect(graph.vertices[i].type).to.be.equal(graphConfig.VERTEX_TYPE.SINK);
          }
        }
      });

    });
  });



});
