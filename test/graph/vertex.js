'use strict';

const chai = require('chai');
const expect = chai.expect;

const vertex = require('../../src/js/graph/vertex');
const graphConfig = require('../../config/graph');
const sigmaConfig = require('../../config/sigma');

describe('Vertex', () => {

  describe('module methods', () => {
    describe('#create', () => {

      it('should instatiate', () => {
        let v = vertex.create();

        expect(v).to.be.an('object');
        expect(v).to.have.property('id').that.is.a('string');
        expect(v).to.have.property('x').that.is.a('number');
        expect(v).to.have.property('y').that.is.a('number');
        expect(v).to.have.property('size').that.is.a('number');
        expect(v).to.have.property('color').that.is.a('string');
        expect(v).to.have.property('label').that.is.a('string');
        expect(v).to.have.property('type').that.is.a('number');

        expect(v.x).to.be.below(graphConfig.GRID_SIZE + 1);
        expect(v.y).to.be.below(graphConfig.GRID_SIZE +1);
        expect(v.size).to.be.equal(sigmaConfig.NODE_SIZE);
        expect(v.color).to.be.equal(sigmaConfig.NODE_COLOR);
        expect(v.label).to.be.equal(v.id);
        expect(v.type).to.be.equal(graphConfig.VERTEX_TYPE.OTHER);

      });

      it('should support custom position', () => {
        let x = 10;
        let y = 10;
        let v = vertex.create(x, y);

        expect(v).to.be.an('object');
        expect(v.x).to.equal(x);
        expect(v.y).to.equal(y);
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
