'use strict';

var chai = require('chai');
var expect = chai.expect;

var arc = require('../../src/graph/arc');

describe('Arc', () => {

  describe('module methods', () => {
    describe('#create', () => {

      it('should instatiate', () => {

        let from     = 'v1';
        let to       = 'v2';
        let capacity = 10;

        let a = arc.create(from, to, capacity);

        expect(a).to.be.an('object');
        expect(a).to.have.property('id').that.is.a('string');
        expect(a).to.have.property('from').that.is.a('string');
        expect(a).to.have.property('to').that.is.a('string');
        expect(a).to.have.property('capacity').that.is.a('number');
        expect(a.from).to.equal(from);
        expect(a.to).to.equal(to);
        expect(a.capacity).to.equal(capacity);

      });

    });
  });

  describe('class methods', () => {
    describe('#equals', () => {

      it('should return true for equal vertices', () => {
        let a = arc.create('v1', 'v2', 10);

        let result = a.equals(a);

        expect(result).to.be.true;
      });

      it ('should return false for non-equal vertices', () => {
        let a1 = arc.create('v1', 'v2', 10);
        let a2 = arc.create('v2', 'v3', 10);

        let result = a1.equals(a2);

        expect(result).to.be.false;
      });

    });
  });

});
