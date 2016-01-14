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
        expect(a).to.have.property('initCapacity').that.is.a('number');
        expect(a).to.have.property('flow').that.is.a('number');
        expect(a).to.have.property('label').that.is.an('string');
        expect(a).to.have.property('distance').that.is.a('number');
        expect(a).to.have.property('type').that.is.a('string');
        expect(a).to.have.property('color').that.is.a('string');
        expect(a).to.have.property('reverse');

        expect(a.from).to.equal(from);
        expect(a.to).to.equal(to);
        expect(a.source).to.equal(from.id);
        expect(a.target).to.equal(to.id);
        expect(a.capacity).to.equal(capacity);
        expect(a.initCapacity).to.equal(capacity);
        expect(a.flow).to.equal(0);
        expect(a.label).to.equal(a.flow + '/' + capacity + '(' + capacity + ')');
        expect(a.type).to.equal(sigmaConfig.EDGE_TYPE);
        expect(a.color).to.equal(sigmaConfig.EDGE_COLOR);
        expect(a.reverse).to.be.null;

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

    describe('#setInitialCapacity', () => {

      it('should update the initial capacity', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 10);

        a.setInitialCapacity(15);

        expect(a.initCapacity).to.equal(15);
      });

      it('should update capacity', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 10);

        a.setInitialCapacity(11);

        expect(a.capacity).to.equal(11);
      });

      it('should return the arc object', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 10);

        expect(a.setInitialCapacity(11)).to.equal(a);
      });

      it('should update the label', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 10);

        a.setInitialCapacity(11);

        expect(a.label).to.equal('0/11(11)');
      });

    });

    describe('#setCapacity', () => {

      it('should update the capacity', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 10);

        a.setCapacity(15);

        expect(a.capacity).to.equal(15);
      });

      it('should update the label', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 10);

        a.setCapacity(11);

        expect(a.label).to.equal('0/10(11)');
      });

      it('should return the arc object', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 10);

        expect(a.setCapacity(5)).to.equal(a);
      });

    });

    describe('#increaseFlow', () => {

      it('should update flow', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 10);

        a.increaseFlow(5);

        expect(a.flow).to.equal(5);

        a.increaseFlow(5);

        expect(a.flow).to.equal(10);
      });

      it('should throw an exception if flow exceeds capacity', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 10);
        let increaseFlow = a.increaseFlow.bind(a, 15);

        expect(increaseFlow).to.throw(Error);
        expect(increaseFlow).to.throw(/exceeds capacity/);
      });

      it('should return the arc object', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 10);

        expect(a.increaseFlow(5)).to.equal(a);
      });

      it('should update the label', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let flow = 5;
        let capacity = 10;
        let a = arc.create(v1, v2, capacity);

        a.increaseFlow(flow);

        expect(a.label).to.equal(flow + '/' + capacity + '(' + (capacity - flow) + ')');
      });

      it('must not change the initial capacity', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 10);

        a.increaseFlow(5);

        expect(a.initCapacity).to.equal(10);
      });

      it('should change the capacity', () => {
        let capacity = 10;
        let flow = 5;
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, capacity);

        a.increaseFlow(flow);

        expect(a.capacity).to.equal(capacity - flow);
      });

      it('should increase the capacity of the residual arc', () => {
        let capacity = 10;
        let flow = 5;
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a1 = arc.create(v1, v2, capacity);
        let a2 = arc.create(v2, v1, capacity);
        a1.reverse = a2;

        a1.increaseFlow(flow);

        expect(a2.capacity).to.equal(capacity + flow);
        expect(a2.label).to.equal(0 + '/' + capacity + '(' + (capacity + flow) + ')')

        a1.increaseFlow(flow);

        expect(a2.capacity).to.equal(capacity + flow + flow);
      });

    });

    describe('#isAdmissable', () => {

      it('should return a boolean value', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 1);

        let admissable = a.isAdmissable();

        expect(admissable).to.be.a('boolean');
      });

      it('should return true for admissable arcs', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 1);

        v1.distance = 1;
        v2.distance = 0;

        let admissable = a.isAdmissable();

        expect(admissable).to.be.true;
      });

      it('should return false for non-admissable arcs', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 1);

        let admissable = a.isAdmissable();

        expect(admissable).to.be.false;
      });

    });

    describe('#reset', () => {

      it('should return the arc', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 10);
        expect(a.reset()).to.be.equal(a);
      });

      it('should reset the capacity', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let initCapacity = 10;
        let a = arc.create(v1, v2, initCapacity);
        a.capacity = 8;

        expect(a.reset().capacity).to.be.equal(initCapacity);
        expect(a.reset().capacity).to.be.equal(a.initCapacity);
      });

      it('should reset the flow', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let a = arc.create(v1, v2, 10);
        a.increaseFlow(5)

        expect(a.reset().flow).to.be.equal(0);
      });

    });
  });

});
