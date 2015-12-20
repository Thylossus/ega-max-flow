const calculation = require('../util/calculation');
const sigmaConfig = require('../../../config/sigma');

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
      this.label = '0/' + this.capacity;
      this.type = sigmaConfig.EDGE_TYPE;
      this.color = sigmaConfig.EDGE_COLOR;
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
