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
        expect(v).to.have.property('outgoingArcs').that.is.an('array');
        expect(v).to.have.property('currentArcIndex').that.is.a('number');
        expect(v).to.have.property('seen').that.is.a('boolean');
        expect(v).to.have.property('finished').that.is.a('boolean');
        expect(v).to.have.property('parent').that.is.null;
        expect(v).to.have.property('parentArc').that.is.null;
        expect(v).to.have.property('parentArcMinCapacity').that.is.a('number');
        expect(v).to.have.property('level').that.is.a('number');
        // Distance label and excess for preflow-push
        expect(v).to.have.property('distance').that.is.a('number');
        expect(v).to.have.property('excess').that.is.a('number');
        expect(v).to.have.property('minNeighborDistance').that.is.a('number');

        expect(v.x).to.be.below(graphConfig.GRID_SIZE + 1);
        expect(v.y).to.be.below(graphConfig.GRID_SIZE +1);
        expect(v.size).to.be.equal(sigmaConfig.NODE_SIZE);
        expect(v.color).to.be.equal(sigmaConfig.NODE_COLOR);
        expect(v.label).to.be.equal(v.id + ' (inf)');
        expect(v.type).to.be.equal(graphConfig.VERTEX_TYPE.OTHER);
        expect(v.outgoingArcs).to.be.empty;
        expect(v.currentArcIndex).to.be.equal(-1);
        expect(v.seen).to.be.false;
        expect(v.finished).to.be.false;
        expect(v.parentArcMinCapacity).to.be.equal(Infinity);
        expect(v.level).to.be.equal(Infinity);
        expect(v.distance).to.be.equal(0);
        expect(v.excess).to.be.equal(0);
        expect(v.minNeighborDistance).to.be.equal(Infinity);

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

    describe('#reset', () => {

      it('should return the vertex', () => {
        let v = vertex.create();
        expect(v.reset()).to.be.equal(v);
      });

      it('should reset the currentArcIndex', () => {
        let v = vertex.create();
        v.currentArcIndex = 1;

        expect(v.reset().currentArcIndex).to.be.equal(-1);
      });

      it('should reset the seen', () => {
        let v = vertex.create();
        v.seen = true;

        expect(v.reset().seen).to.be.false;
      });

      it('should reset the finished', () => {
        let v = vertex.create();
        v.finished = true;

        expect(v.reset().finished).to.be.false;
      });

      it('should reset the parent, parent arc, and parent arc min capacity property', () => {
        let v = vertex.create();
        v.parent = 1;
        v.parentArc = 2;
        v.parentArcMinCapacity = 3;

        v.reset();

        expect(v.parent).to.be.null;
        expect(v.parentArc).to.be.null;
        expect(v.parentArcMinCapacity).to.equal(Infinity);
      });

      it('should reset the level', () => {
        let v = vertex.create();
        v.setLevel(10);

        v.reset();

        expect(v.level).to.be.equal(Infinity);
        expect(v.label).to.be.equal(v.id + ' (inf)');
      });

      it('should reset the distance', () => {
        let v = vertex.create();
        v.distance = 10;

        v.reset();

        expect(v.distance).to.be.equal(0);
      });

      it('should reset the excess', () => {
        let v = vertex.create();
        v.excess = 10;

        v.reset();

        expect(v.excess).to.be.equal(0);
      });

    });

    describe('#setLevel', () => {

      it('should change the level', () => {
        let v = vertex.create();
        let lvl = 10;

        v.setLevel(lvl);

        expect(v.level).to.equal(lvl);
      });

      it('should change the label', () => {
        let v = vertex.create();
        let lvl = 10;

        v.setLevel(lvl);

        expect(v.label).to.equal(v.id + ' (' + lvl + ')');
      });

    });

    describe('#nextArc', () => {

      it('should return an arc if there is a next arc', () => {
        let v = vertex.create();
        v.outgoingArcs = [1, 2, 3];

        expect(v.nextArc()).to.be.equal(v.outgoingArcs[0]);
      });

      it('should return null if there is no next arc', () => {
        let v = vertex.create();
        expect(v.nextArc()).to.be.null;
      });

    });

  });

});
