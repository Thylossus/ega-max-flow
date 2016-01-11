const graphTraversal = require('./graphTraversal');
const fordFulkerson = require('./fordFulkerson');
const edmondsKarp = require('./edmondsKarp');
const dinic = require('./dinic');
const preflowPush = require('./preflowPush');

(function () {
  'use strict';

  exports.graphTraversal = graphTraversal;
  exports.fordFulkerson = fordFulkerson;
  exports.edmondsKarp = edmondsKarp;
  exports.dinic = dinic;
  exports.preflowPush = preflowPush;
})();
