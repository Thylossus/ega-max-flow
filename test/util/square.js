'use strict';

const chai = require('chai');
const expect = chai.expect;

const square = require('../../src/js/util/square');

describe('Square', () => {

  describe('#separate', () => {

    it('should divide a square into n quadrants', () => {
      let n = 10;
      let squareSize = 1000;

      let result = square.separate(squareSize, n);

      expect(result).to.be.an('object');
      expect(result).to.have.property('quadrants').that.is.an('array');
      expect(result).to.have.property('numberOfQuadrants').that.is.an('number');
      expect(result).to.have.property('numberOfSegments').that.is.an('number');

      expect(result.numberOfSegments).to.be.below(n);
      expect(result.numberOfQuadrants).to.be.equal(result.numberOfSegments * result.numberOfSegments);

      result.quadrants.forEach((quadrant) => {
        expect(quadrant).to.be.an('object');
        expect(quadrant).to.have.property('x1').that.is.a('number');
        expect(quadrant).to.have.property('x2').that.is.a('number');
        expect(quadrant).to.have.property('y1').that.is.a('number');
        expect(quadrant).to.have.property('y2').that.is.a('number');
        expect(quadrant).to.have.property('id').that.is.a('number');
      });

      let last = result.quadrants.pop();
      expect(last.y2).to.be.below(squareSize + 1);
      expect(last.x2).to.be.below(squareSize + 1);
    });

  });

});
