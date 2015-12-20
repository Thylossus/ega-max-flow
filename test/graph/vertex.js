'use strict';

const chai = require('chai');
const expect = chai.expect;

const vertex = require('../../src/js/graph/vertex');
const graphConfig = require('../../config/graph');

describe('Vertex', () => {

  describe('module methods', () => {
    describe('#create', () => {

      it('should instatiate', () => {

        let v = vertex.create();

        expect(v).to.be.an('object');
        expect(v).to.have.property('id').that.is.a('string');
        expect(v).to.have.property('x').that.is.a('number');
        expect(v).to.have.property('y').that.is.a('number');

        expect(v.x).to.be.below(graphConfig.GRID_SIZE + 1);
        expect(v.y).to.be.below(graphConfig.GRID_SIZE +1);

      });

    });
  });

  describe('class methods', () => {
    describe('#equals', () => {

      it('should return true for equal vertices', () => {
        let v = vertex.create();

        let result = v.equals(v);

        expect(result).to.be.true;
      });

      it ('should return false for non-equal vertices', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();

        let result = v1.equals(v2);

        expect(result).to.be.false;
      });

    });
  });

});
