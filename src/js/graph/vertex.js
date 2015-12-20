const random = require('lodash/number/random');
const graphConfig = require('../../../config/graph');

(function () {
  'use strict';

  var count = 0;

  function id_gen() {
    count += 1;
    return `v${count}`;
  }

  class Vertex {
    constructor() {
      this.id = id_gen();
      this.x = random(graphConfig.GRID_SIZE);
      this.y = random(graphConfig.GRID_SIZE);
    }

    equals(other) {
      return this.id === other.id;
    }
  }

  exports.create = () => {
    return new Vertex();
  }
})();
