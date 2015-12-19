'use strict';

var chai = require('chai');
var expect = chai.expect;

var vertex = require('../../src/graph/vertex');

describe('Vertex', () => {

  describe('module methods', () => {
    describe('#create', () => {

      it('should instatiate', () => {

        let v = vertex.create();

        expect(v).to.be.an('object');
        expect(v).to.have.property('id').that.is.a('string');

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
