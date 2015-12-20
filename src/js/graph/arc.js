const calculation = require('../util/calculation');

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
      this.source = from.id;
      this.target = to.id;
      this.capacity = capacity;
      this.distance = calculation.euclidianDistance(from, to);
    }

    equals(other) {
      return this.id === other.id;
    }

    compare(other) {
      return this.distance - other.distance;
    }
  }

  exports.create = (from, to, capacity) => {
    return new Arc(from, to, capacity);
  };

})();
