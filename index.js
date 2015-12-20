const generator = require('./src/graph/generator');

(function () {
  'use strict';

  let gen = generator.create(10, 100);

  console.log(gen.run());
})();
