(function () {
  'use strict';

  var count = 0;

  function id_gen() {
    count += 1;
    return `a${count}`;
  }

  class Arc {
    constructor(from, to, capacity) {
      this.id = id_gen();
      this.from = from;
      this.to = to;
      this.capacity = capacity;
    }

    equals(other) {
      return this.id === other.id;
    }
  }

  exports.create = (from, to, capacity) => {
    return new Arc(from, to, capacity);
  }

})();
