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
      this.flow = 0;
      this.distance = calculation.euclidianDistance(from, to);
      this.label = this.flow + '/' + this.capacity;
      this.type = sigmaConfig.EDGE_TYPE;
      this.color = sigmaConfig.EDGE_COLOR;
      this.reverse = null;
    }

    equals(other) {
      return this.id === other.id;
    }

    compare(other) {
      return this.distance - other.distance;
    }

    setCapacity(capacity) {
      this.capacity = capacity;
      this.label = this.flow + '/' + this.capacity;

      return this;
    }

    setFlow(flow) {
      if (flow > this.capacity) {
        throw new Error('Flow exceeds capacity');
      }

      this.flow = flow;
      this.label = this.flow + '/' + this.capacity;
      return this;
    }
  }

  exports.create = (from, to, capacity) => {
    return new Arc(from, to, capacity);
  };

})();
