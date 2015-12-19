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
    }

    equals(other) {
      return this.id === other.id;
    }
  }

  exports.create = () => {
    return new Vertex();
  }
})();
