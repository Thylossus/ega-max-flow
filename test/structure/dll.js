'use strict';

const chai = require('chai');
const expect = chai.expect;

const dll = require('../../src/js/structure/dll');

describe('Doubly Linked List', () => {

  describe('module methods', () => {

    describe('#create', () => {

      it('should instantiate a linked list', () => {
        let list = dll.create();

        expect(list).to.be.an('object');
        expect(list).to.be.an.instanceof(dll.DLL);
      });

      it('should instantiate a linked list with the required attributes and methods', () => {
        let list = dll.create();

        // Attributes
        expect(list).to.have.property('length').that.is.a('number');
        expect(list).to.have.property('head').that.is.null;
        expect(list).to.have.property('tail').that.is.null;

        // Methods
        expect(list).to.have.property('add').that.is.a('function');
        expect(list).to.have.property('remove').that.is.a('function');
        expect(list).to.have.property('get').that.is.a('function');
        expect(list).to.have.property('toArray').that.is.a('function');
        expect(list).to.have.property('toString').that.is.a('function');
        expect(list).to.have.property('forEach').that.is.a('function');
      });

      it('should optionally take an array as a initialization input', () => {
        let array = [1, 2, 3, 4, 5];
        let first = array[0];
        let last = array[4];

        let list = dll.create(array);

        expect(list.head).not.to.be.null;
        expect(list.tail).not.to.be.null;
        expect(list.head.value).to.be.equal(first);
        expect(list.tail.value).to.be.equal(last);

        let iterator = list.head;
        let counter = 0;

        while (iterator) {
          expect(iterator.value).to.be.equal(array[counter]);

          counter += 1;
          iterator = iterator.next;
        }
      });

      it('should create a list consisting of list element objects', () => {
        let array = [1, 2, 3, 4, 5];

        let list = dll.create(array);

        expect(list.head).to.be.an.instanceof(dll.Element);
        expect(list.tail).to.be.an.instanceof(dll.Element);

        let iterator = list.head;

        while (iterator) {
          expect(iterator).to.be.an.instanceof(dll.Element);

          iterator = iterator.next;
        }
      });

      it('should throw an error if it receives a parameter that is not an array', () => {
        let create = dll.create.bind(null, {});

        expect(create).to.throw(Error);
        expect(create).to.throw('Provided parameter is not an array.');
      });

      it('should create a list of the correct length', () => {
        let array = [1, 2, 3, 4, 5];

        let list = dll.create(array);

        expect(list.length).to.be.equal(array.length);
      });

    });

  });

  describe('class methods', () => {

    describe('#add', () => {

      it('should return the created element', () => {
        let list = dll.create();
        let value = 1;

        let element = list.add(value);

        expect(element).to.be.an.instanceof(dll.Element);
        expect(element.value).to.be.equal(value);
      });

      it('should append the created element to the end of the list', () => {
        let list = dll.create();
        let value = 1;

        let element = list.add(value);

        expect(list.tail).to.equal(element);
        expect(list.tail.value).to.equal(value);
      });

      it('should allow to add an element at a specific index', () => {
        let array = [1, 2, 4, 5];
        let list = dll.create(array);
        let value = 3;
        let index = 2;

        let element = list.add(value, index);
        let iterator = list.head;

        for (var i = 0; i < list.length; i++) {
          if (i < index) {
            expect(iterator.value).to.equal(array[i]);
          } else if (i > index) {
            expect(iterator.value).to.equal(array[i - 1]);
          } else {
            expect(iterator.value).to.equal(value);
          }

          iterator = iterator.next;
        }
      });

      it('should throw an error for invalid indizes', () => {
        // Valid indizes: 0 <= index <= list.length
        let array = [1, 2, 4, 5];
        let list = dll.create(array);

        let neg = list.add.bind(list, 'value', -1);
        let toolarge = list.add.bind(list, 'value', array.length + 1);
        let okay = list.add.bind(list, 'value', array.length);

        expect(neg).to.throw(RangeError);
        expect(toolarge).to.throw(RangeError);
        expect(okay).not.to.throw(Error);

      });

      it('should increase the length', () => {
        let array = [1, 2, 3, 4, 5];
        let list = dll.create(array);

        list.add(6);

        expect(list.length).to.be.equal(array.length + 1);
      });

    });

    describe('#remove', () => {

      it('should remove a provided item from the list', () => {
        let list = dll.create();
        list.add(1);
        list.add(2);
        let deleteElement = list.add(3);
        list.add(4);
        list.add(5);

        list.remove(deleteElement);

        list.forEach((element) => {
          expect(element).not.to.equal(deleteElement);
        });
      });

      it('should reduce the size of the list', () => {
        let list = dll.create();
        list.add(1);
        list.add(2);
        let deleteElement = list.add(3);
        list.add(4);
        list.add(5);

        expect(list.length).to.equal(5);

        list.remove(deleteElement);

        expect(list.length).to.equal(4);
      });

      it('should be able to delete the first element', () => {
        let list = dll.create();
        let deleteElement = list.add(1);
        let secondElement = list.add(2);
        list.add(3);
        list.add(4);
        list.add(5);

        list.remove(deleteElement);

        expect(list.head).to.equal(secondElement);
      });

      it('should be able to delete the last element', () => {
        let list = dll.create();
        list.add(1);
        list.add(2);
        list.add(3);
        let secondLastElement = list.add(4);
        let deleteElement = list.add(5);

        list.remove(deleteElement);

        expect(list.tail).to.equal(secondLastElement);
      });

      it('should be able to delete an element from a list with only one element', () => {
        let list = dll.create();
        let deleteElement = list.add(1);

        list.remove(deleteElement);

        expect(list.isEmpty()).to.be.true;
      });

    });

    describe('#get', () => {

      it('should return the element at the provided index', () => {
        let index = 2;
        let value = 3;
        let array = [1, 2, value, 4, 5];

        let list = dll.create(array);
        let element = list.get(index);

        expect(element).to.be.an.instanceof(dll.Element);
        expect(element.value).to.be.equal(value);
      });

      it('shold throw an error for invalid indizes', () => {
        // Valid indizes: 0 <= index < list.length
        let array = [1, 2, 4, 5];
        let list = dll.create(array);

        let neg = list.get.bind(list, -1);
        let toolarge = list.get.bind(list, array.length);
        let okay = list.get.bind(list, array.length - 1);

        expect(neg).to.throw(RangeError);
        expect(toolarge).to.throw(RangeError);
        expect(okay).not.to.throw(Error);

      });

    });

    describe('#toArray', () => {

      it('should return an array', () => {
        let list = dll.create();

        expect(list.toArray()).to.be.an('array');
      });

      it('should include all elements', () => {
        let array = [1, 2, 3];
        let list = dll.create(array);

        let output = list.toArray();

        expect(output.length).to.be.equal(array.length);

        output.forEach((value, index) => {
          expect(value).to.be.equal(array[index]);
        });
      });

    });

    describe('#toString', () => {

      it('should create an empty string for an empty list', () => {
        let list = dll.create();

        expect(list.toString()).to.be.empty;
      });

      it('should create the same output as Array.prototype.toString', () => {
        let array = [1, 2, 3];
        let list = dll.create(array);

        expect(list.toString()).to.be.equal(array.toString());
      });

    });

    describe('#forEach', () => {

      it('should iterator over all elements', () => {
        let array = [1, 2, 3];
        let list = dll.create(array);

        list.forEach((element, index) => {
          expect(element.value).to.be.equal(array[index]);
        });
      });

      it('should terminate early if false is returned', () => {
        let array = [1, 2, 3];
        let list = dll.create(array);
        let terminationIndex = 1;
        let terminationValue = array[terminationIndex];

        let terminationElement;

        list.forEach((element, index) => {
          terminationElement = element;

          if (index === terminationIndex) {
            return false;
          }
        });

        expect(terminationElement.value).to.be.equal(terminationValue);
      });

    });

    describe('#isEmpty', () => {

      it('should return false for an empty list', () => {
        let list = dll.create();

        expect(list.isEmpty()).to.be.true;
      });

      it('should return true for a non-empty list', () => {
        let list = dll.create([1, 2, 3]);

        expect(list.isEmpty()).to.be.false;
      });

    });

  });

});
