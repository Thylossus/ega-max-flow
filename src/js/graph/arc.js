const calculation = require('../util/calculation');
const sigmaConfig = require('../../../config/sigma');

(function () {
  'use strict';

  var count = 0;

  function id_gen() {
    count += 1;
    return `a${count}`;
  }

  function buildLabel(arc) {
    return arc.flow + '/' + arc.initCapacity + '(' + arc.capacity + ')';
  }

  class Arc {
    constructor(from, to, capacity) {
      this.id = id_gen();
      this.from = from;
      this.to = to;
      this.source = from.id;
      this.target = to.id;
      this.capacity = capacity;
      this.initCapacity = capacity;
      this.flow = 0;
      this.distance = calculation.euclidianDistance(from, to);
      this.label = buildLabel(this);
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

    setInitialCapacity(capacity) {
      this.initCapacity = capacity;
      this.setCapacity(capacity);

      return this;
    }

    setCapacity(capacity) {
      this.capacity = capacity;
      this.label = buildLabel(this);

      return this;
    }

    increaseFlow(flow) {
      if (flow > this.capacity) {
        throw new Error('Flow exceeds capacity');
      }

      // Set flow
      this.flow = this.flow + flow;

      // Update capacity
      this.capacity = this.capacity - flow;

      // Update label
      this.label = buildLabel(this);

      // If a reverse arc exists, update it
      if (this.reverse) {
        this.reverse.setCapacity(this.reverse.capacity + flow);
      }

      return this;
    }

    reset() {
      this.capacity = this.initCapacity;
      this.flow = 0;
      this.label = buildLabel(this);

      return this;
    }
  }

  exports.create = (from, to, capacity) => {
    return new Arc(from, to, capacity);
  };

})();
