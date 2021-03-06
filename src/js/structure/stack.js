(function() {
  'use strict';

  class Stack {
    constructor() {
      this.stackHead = null;
      this.empty = true;
      this.length = 0;
    }

    push(value) {
      let newValue = {
        value: value
      };

      // Update empty state and length
      this.empty = false;
      this.length += 1;

      newValue.next = this.stackHead;
      this.stackHead = newValue;

      return value;
    }

    pop() {
      if (this.empty) {
        throw new Error('Stack is empty. Cannot call pop().');
      }

      let element = this.stackHead;
      this.stackHead = element.next;
      this.empty = this.stackHead === null;
      this.length -= 1;

      return element.value;
    }

    top() {
      if (this.empty) {
        return null;
      }

      return this.stackHead.value;
    }

    toString() {
      let item = this.stackHead;

      if (!item) {
        return 'empty';
      }

      let representation = '-> ' + (item.value.hasOwnProperty('id') ? item.value.id : item.value);

      while (item = item.next) {
        representation = representation + ' > ' + (item.value.hasOwnProperty('id') ? item.value.id : item.value);
      }

      return representation;
    }
  }

  exports.create = () => {
    return new Stack();
  };

  exports.Stack = Stack;
}());
