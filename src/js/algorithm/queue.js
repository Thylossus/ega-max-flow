(function() {
  'use strict';

  class Queue {
    constructor() {
      this.queueHead = null;
      this.queueTail = null;
      this.empty = true;
      this.length = 0;
    }

    push(value) {
      let newValue = {
        value: value,
        next: null
      };

      // Update empty state and length
      this.empty = false;
      this.length += 1;

      // Set new element as last element
      if (this.queueTail !== null) {
        this.queueTail.next = newValue;
      }
      this.queueTail = newValue;

      // Update first element if the new element is the first element that is added to an empty list
      if (this.queueHead === null) {
        this.queueHead = newValue;
      }

      return value;
    }

    pop() {
      if (this.empty) {
        throw new Error('Queue is empty. Cannot call pop().');
      }
      let element = this.queueHead;

      if (this.queueHead === this.queueTail) {
        // Remove references
        this.queueHead = null;
        this.queueTail = null;

        // Set length and empty state
        this.empty = true;
        this.length = 0;
      } else {
        this.queueHead = element.next;
        this.length -= 1;
      }

      return element.value;
    }

    top() {
      if (this.empty) {
        return null;
      }

      return this.queueHead.value;
    }

    toString() {
      let item = this.queueHead;

      if (!item) {
        return 'empty';
      }

      let representation = '-> ' + item.value;

      while (item = item.next) {
        representation = representation + ' < ' + item.value;
      }

      return representation;
    }
  }

  exports.create = () => {
    return new Queue();
  };

  exports.Queue = Queue;
}());
