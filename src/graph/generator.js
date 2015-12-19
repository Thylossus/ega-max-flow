(function () {
  'use strict';

  class Generator {
    constructor(numberOfVertices, maxCapacity) {
      this.numberOfVertices = numberOfVertices;
      this.maxCapacity = maxCapacity;
    }
  }

  exports.create = (numberOfVertices, maxCapacity) => {
    return new Generator(numberOfVertices, maxCapacity);
  };
})();
