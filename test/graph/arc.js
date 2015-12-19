'use strict';

var chai = require('chai');
var expect = chai.expect;

var arc = require('../../src/graph/arc');

describe('Arc', () => {

  describe('#create', () => {

    it('should instatiate', () => {

      let from     = 'n1';
      let to       = 'n2';
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
