const isArray = require('lodash/lang/isArray');

(function() {
  'use strict';

  class DLL {
    constructor(array) {
      this.length = 0;
      this.head = null;
      this.tail = null;

      if (array) {
        if (!isArray(array)) {
          throw new Error('Provided parameter is not an array.');
        }

        let prev;

        array.forEach((value) => {
          this.add(value);
        });
      }
    }

    add(value, index) {
      let element = new Element(value);

      if (index === undefined) {
        if (this.isEmpty()) {
          this.head = element;
          this.tail = element;
        } else {
          this.tail.next = element;
          element.prev = this.tail;
          this.tail = element;
        }
      } else {
        if (index < 0 || index > this.length) {
          throw new RangeError('Index out of bounds');
        }

        if (index === 0) {
          // Add to front of list
          element.next = this.head;
          this.head = element;

          if (this.isEmpty()) {
            this.tail = this.head;
          }

          this.length += 1;

          return element;
        }

        if (index === this.length) {
          // Add to end of list
          return this.add(value);
        }

        let iterator = this.head;
        let counter = 0;

        while (iterator) {
          if (counter === index) {
            iterator.prev.next = element;
            element.prev = iterator.prev;
            iterator.prev = element;
            element.next = iterator;

            iterator = null;
          } else {
            iterator = iterator.next;
          }
          counter += 1;
        }
      }

      this.length += 1;

      return element;
    }

    remove(element) {
      if (this.length === 1) {
        this.head = null;
        this.tail = null;
      } else if (element === this.head) {
        this.head = this.head.next;
        element.next.prev = element.prev;
      } else if (element === this.tail) {
        this.tail = this.tail.prev;
        element.prev.next = element.next;
      } else {
        element.prev.next = element.next;
        element.next.prev = element.prev;
      }

      element.next = null;
      element.prev = null;

      this.length -= 1;
    }

    get(index) {
      if (index < 0 || index >= this.length) {
        throw new RangeError('Index out of bounds');
      }

      let iterator = this.head;
      let counter = 0;

      while (iterator) {
        if (counter === index) {
          return iterator;
        }

        iterator = iterator.next;
        counter += 1;
      }
    }

    toArray() {
      let array = [];

      let iterator = this.head;

      while (iterator) {
        array.push(iterator.value);
        iterator = iterator.next;
      }

      return array;
    }

    toString() {
      if (this.isEmpty()) {
        return '';
      }

      let iterator = this.head;
      let string = iterator.value;

      while (iterator = iterator.next) {
        string += ',' + iterator.value;
      }

      return string;
    }

    forEach(callback) {
      let iterator = this.head;
      let counter = 0;

      while (iterator) {
        let result = callback(iterator, counter, this);

        if (result === false) {
          return;
        }

        iterator = iterator.next;
        counter += 1;
      }
    }

    isEmpty() {
      return this.length === 0;
    }
  }

  class Element {
    constructor(value) {
      this.value = value;
      this.next = null;
      this.prev = null;
    }
  }

  exports.create = (array) => {
    return new DLL(array);
  };

  exports.DLL = DLL;
  exports.Element = Element;

}());
