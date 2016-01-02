const queue = require('./queue');
const stack = require('./stack');
const graphTraversal = require('./graphTraversal');
const fordFulkerson = require('./fordFulkerson');
const edmondsKarp = require('./edmondsKarp');

(function () {
  'use strict';

  exports.queue = queue;
  exports.stack = stack;
  exports.graphTraversal = graphTraversal;
  exports.fordFulkerson = fordFulkerson;
  exports.edmondsKarp = edmondsKarp;
})();
