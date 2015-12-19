'use strict';

var chai = require('chai');
var expect = chai.expect;

var graph = require('../../src/graph/graph');
var vertex = require('../../src/graph/vertex');
var arc = require('../../src/graph/arc');

describe('Graph', () => {

  describe('module methods', () => {
    describe('#create', () => {

      it('should instatiate default', () => {
        let g = graph.create();

        expect(g).to.be.an('object');
        expect(g).to.have.property('vertices').that.is.an.instanceof(Array);
        expect(g).to.have.property('arcs').that.is.an.instanceof(Array);
        expect(g.vertices).to.have.length(0);
        expect(g.arcs).to.have.length(0);

      });

      it('should instatiate with vertices and arcs', () => {
        // let

        let vertices = ['v1', 'v2', 'v3'];
        let arcs = [];

        let g = graph.create();

        expect(g).to.be.an('object');
        expect(g).to.have.property('vertices').that.is.an.instanceof(Array);
        expect(g).to.have.property('arcs').that.is.an.instanceof(Array);
        expect(g.vertices).to.have.length(0);
        expect(g.arcs).to.have.length(0);

      });

    });
  });

  describe('class methods', () => {

  });

});
