'use strict';

const chai = require('chai');
const expect = chai.expect;

const arc = require('../../src/js/graph/arc');
const vertex = require('../../src/js/graph/vertex');
const graphConfig = require('../../config/graph');
const sigmaConfig = require('../../config/sigma');

describe('Arc', () => {

  describe('module methods', () => {
    describe('#create', () => {

      it('should instatiate', () => {

        let from     = vertex.create();
        let to       = vertex.create();
        let capacity = 10;

        let a = arc.create(from, to, capacity);

        expect(a).to.be.an('object');
        expect(a).to.have.property('id').that.is.an('string');
        expect(a).to.have.property('from').that.is.an('object');
        expect(a).to.have.property('to').that.is.a('object');
        expect(a).to.have.property('source').that.is.a('string');
        expect(a).to.have.property('target').that.is.a('string');
        expect(a).to.have.property('capacity').that.is.a('number');
        expect(a).to.have.property('label').that.is.an('string');
        expect(a).to.have.property('distance').that.is.a('number');
        expect(a).to.have.property('type').that.is.a('string');
        expect(a).to.have.property('color').that.is.a('string');
        expect(a.from).to.equal(from);
        expect(a.to).to.equal(to);
        expect(a.source).to.equal(from.id);
        expect(a.target).to.equal(to.id);
        expect(a.capacity).to.equal(capacity);
        expect(a.label).to.equal('0/' + capacity);
        expect(a.type).to.equal(sigmaConfig.EDGE_TYPE);
        expect(a.color).to.equal(sigmaConfig.EDGE_COLOR);

      });

    });
  });

  describe('class methods', () => {
    describe('#equals', () => {

      it('should return true for equal vertices', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 10);

        let result = a.equals(a);

        expect(result).to.be.true;
      });

      it ('should return false for non-equal vertices', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let v3 = vertex.create();
        let a1 = arc.create(v1, v2, 10);
        let a2 = arc.create(v2, v3, 10);

        let result = a1.equals(a2);

        expect(result).to.be.false;
      });

    });

    describe('#compare', () => {

      it('should return < 0 if other arc has higher distance', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 10);

        expect(a.compare({distance: graphConfig.GRID_SIZE * 2})).to.be.below(0);
      });

      it('should return = 0 if other arc has the same distance', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 10);

        expect(a.compare(a)).to.equal(0);
      });

      it('should return > 0 if other arc has lower distance', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 10);

        expect(a.compare({distance: -1})).to.be.above(0);
      });

    });

    describe('#setCapacity', () => {

      it('should update capacity', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 10);

        a.setCapacity(11);

        expect(a.capacity).to.equal(11);
      });

      it('should return the arc object', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 10);

        expect(a.setCapacity(11)).to.equal(a);
      });

      it('should update the label', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 10);

        a.setCapacity(11);

        expect(a.label).to.match(/\/11/);
      });

    });
  });

});
