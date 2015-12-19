'use strict';

var chai = require('chai');
var expect = chai.expect;

var vertex = require('../../src/graph/vertex');

describe('Vertex', () => {

  describe('#create', () => {

    it('should instatiate', () => {

      let v = vertex.create();

      expect(v).to.be.an('object');
      expect(v).to.have.property('id').that.is.a('string');

    });

  });

});
