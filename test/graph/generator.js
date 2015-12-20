'use strict';

const chai = require('chai');
const expect = chai.expect;

const generator = require('../../src/graph/generator');

describe('Generator', () => {

  describe('module methods', () => {
    describe('#create', () => {

      it('should instatiate', () => {
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

    });
  });



});
