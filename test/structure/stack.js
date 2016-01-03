'use strict';

const chai = require('chai');
const expect = chai.expect;

const stack = require('../../src/js/structure/stack');

describe('Stack', () => {

  describe('module methods', () => {
    describe('#create', () => {

      it('should instantiate', () => {
        let s = stack.create();

        expect(s).to.be.an('object');
        expect(s).to.have.property('stackHead').that.is.null;
        expect(s).to.have.property('empty').that.is.true;
        expect(s).to.have.property('length').that.is.equal(0);
      });

    });
  });

  describe('class methods', () => {
    describe('#push', () => {

      it('should add an item to the top of the stack', () => {
        let s = stack.create();
        let value = 1;

        s.push(value);

        expect(s.stackHead.value).to.equal(value);

      });

      it('should update empty state', () => {
        let s = stack.create();
        let value = 1;

        s.push(value);

        expect(s.empty).to.be.false;
      });

      it('should update length', () => {
        let s = stack.create();
        let value = 1;
        let priorLength = s.length;

        s.push(value);

        expect(s.length).to.be.above(0);
        expect(s.length).to.be.equal(priorLength + 1);

        priorLength = s.length;

        s.push(value);
        s.push(value);

        expect(s.length).to.be.equal(priorLength + 2);
      });

      it('should return the pushed value', () => {
        let s = stack.create();
        let value = 1;

        expect(s.push(value)).to.equal(value);
      });

    });

    describe('#pop', () => {

      it('should remove an item from the top of the stack', () => {
        let s = stack.create();
        let value = 1;

        s.push(value);

        let priorStackHead = s.stackHead;

        s.pop();

        expect(s.stackHead).to.not.equal(priorStackHead);

      });

      it('should update empty state', () => {
        let s = stack.create();
        let value = 1;

        s.push(value);

        expect(s.empty).to.be.false;

        s.pop();

        expect(s.empty).to.be.true;

      });

      it('should update length', () => {
        let s = stack.create();
        let value = 1;

        s.push(value);

        let priorLength = s.length;

        s.pop();

        expect(s.length).to.be.equal(priorLength - 1);
      });

      it('should return the popped value', () => {
        let s = stack.create();
        let value = 1;

        s.push(value);

        expect(s.pop()).to.equal(value);
      });

      it('should throw an exception if it is called on an empty stack', () => {
        let s = stack.create();
        let pop = s.pop.bind(s);

        expect(pop).to.throw(Error);
      });

    });

    describe('#top', () => {

      it('should return the first element of the stack', () => {
        let s = stack.create();
        let value = 1;

        s.push(value);

        expect(s.top()).to.equal(value);
      });

      it('must not change the stack\'s state', () => {
        let s = stack.create();
        let value = 1;

        s.push(value);

        let prevEmpty = s.empty;
        let prevLength = s.length;

        s.top();

        expect(s.empty).to.equal(prevEmpty);
        expect(s.length).to.equal(prevLength);
      });

      it('should return null for an empty stack', () => {
        let s = stack.create();
        expect(s.top()).to.be.null;
      });

    });

    describe('#toString', () => {

      it('should return a string', () => {
        let s = stack.create();

        expect(s.toString()).to.be.a('string');
      });

      it('should return "empty" for an empty queue', () => {
        let s = stack.create();

        expect(s.toString()).to.equal('empty');
      });

      it('should transfer the queue into a string representation', () => {
        let s = stack.create();
        let v1 = 1;
        let v2 = 2;
        let v3 = 3;
        let v4 = 4;

        s.push(v1);
        s.push(v2);
        s.push(v3);
        s.push(v4);

        expect(s.toString()).to.equal('-> ' + v4 + ' > ' + v3 + ' > ' + v2 + ' > ' + v1);
      });

    });

  });

});
