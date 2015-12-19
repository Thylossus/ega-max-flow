'use strict';

var chai = require('chai');
var expect = chai.expect;

var generator = require('../../src/graph/generator');

describe('Vertex', () => {

  describe('#create', () => {

    it('should instatiate', () => {
      let vertices = 10;
      let maxCapacity = 100;

      let g = generator.create(vertices, maxCapacity);

      expect(g).to.be.an('object');
      expect(g).to.have.property('numberOfVertices').that.is.a('number');
      expect(g).to.have.property('maxCapacity').that.is.a('number');
      expect(g.numberOfVertices).to.equal(vertices);
      expect(g.maxCapacity).to.equal(maxCapacity);

    });

  });

});
