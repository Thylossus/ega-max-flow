'use strict';

const chai = require('chai');
const expect = chai.expect;

const queue = require('../../src/js/algorithm/queue');

describe('Queue', () => {

  describe('module methods', () => {
    describe('#create', () => {

      it('should instantiate', () => {
        let q = queue.create();

        expect(q).to.be.an('object');
        expect(q).to.have.property('queueHead').that.is.null;
        expect(q).to.have.property('queueTail').that.is.null;
        expect(q).to.have.property('empty').that.is.true;
        expect(q).to.have.property('length').that.is.equal(0);
      });

    });
  });

  describe('class methods', () => {
    describe('#push', () => {

      it('should add an item to the end of the queue', () => {
        let q = queue.create();
        let value = 1;

        q.push(value);

        expect(q.queueHead.value).to.equal(value);
        expect(q.queueTail.value).to.equal(value);

      });

      it('should update empty state', () => {
        let q = queue.create();
        let value = 1;

        q.push(value);

        expect(q.empty).to.be.false;
      });

      it('should update length', () => {
        let q = queue.create();
        let value = 1;
        let priorLength = q.length;

        q.push(value);

        expect(q.length).to.be.above(0);
        expect(q.length).to.be.equal(priorLength + 1);

        priorLength = q.length;

        q.push(value);
        q.push(value);

        expect(q.length).to.be.equal(priorLength + 2);
      });

      it('should return the pushed value', () => {
        let q = queue.create();
        let value = 1;

        expect(q.push(value)).to.equal(value);
      });

    });

    describe('#pop', () => {

      it('should remove an item from the start of the queue', () => {
        let q = queue.create();
        let value = 1;

        q.push(value);

        let priorQueueHead = q.queueHead;

        q.pop();

        expect(q.queueHead).to.not.equal(priorQueueHead);

      });

      it('should update empty state', () => {
        let q = queue.create();
        let value = 1;

        q.push(value);

        expect(q.empty).to.be.false;

        q.pop();

        expect(q.empty).to.be.true;

      });

      it('should update length', () => {
        let q = queue.create();
        let value = 1;

        q.push(value);

        let priorLength = q.length;

        q.pop();

        expect(q.length).to.be.equal(priorLength - 1);
      });

      it('should return the popped value', () => {
        let q = queue.create();
        let value = 1;

        q.push(value);

        expect(q.pop()).to.equal(value);
      });

      it('should throw an exception if it is called on an empty queue', () => {
        let q = queue.create();
        let pop = q.pop.bind(q);

        expect(pop).to.throw(Error);
      });

    });

    describe('#top', () => {

      it('should return the first element of the queue', () => {
        let q = queue.create();
        let value = 1;

        q.push(value);

        expect(q.top()).to.equal(value);
      });

      it('must not change the queue\'s state', () => {
        let q = queue.create();
        let value = 1;

        q.push(value);

        let prevEmpty = q.empty;
        let prevLength = q.length;

        q.top();

        expect(q.empty).to.equal(prevEmpty);
        expect(q.length).to.equal(prevLength);
      });

      it('should return null for an empty queue', () => {
        let q = queue.create();
        expect(q.top()).to.be.null;
      });

    });

    describe('#toString', () => {

      it('should return a string', () => {
        let q = queue.create();

        expect(q.toString()).to.be.a('string');
      });

      it('should return "empty" for an empty queue', () => {
        let q = queue.create();

        expect(q.toString()).to.equal('empty');
      });

      it('should transfer the queue into a string representation', () => {
        let q = queue.create();
        let v1 = 1;
        let v2 = 2;
        let v3 = 3;
        let v4 = 4;

        q.push(v1);
        q.push(v2);
        q.push(v3);
        q.push(v4);

        expect(q.toString()).to.equal('-> ' + v1 + ' < ' + v2 + ' < ' + v3 + ' < ' + v4);
      });

    });
  });

});
