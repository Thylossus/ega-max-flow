const queue = require('./queue');
const stack = require('./stack');

(function() {
  'use strict';

  function* traverse(graph, store) {
    yield 1;
    return 2;
  }

  exports.init = (graph, store) => {
    if (!(store instanceof queue.Queue) && !(store instanceof stack.Stack)) {
      throw new Error('Unsupported data structure. Please provide queue or stack');
    }

    return traverse(graph, store);
  };
}());
