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
  }

  exports.create = () => {
    return new Vertex();
  }
})();
