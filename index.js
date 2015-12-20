const graph = require('./src/js/graph');
const util = require('./src/js/util');

(function () {
  'use strict';

  // TODO: think of which tools to expose
  exports.graph = graph;
  exports.util = util;

  if (window) {
    let egamaxflow = window.egamaxflow = {};
    egamaxflow.graph = graph;
    egamaxflow.util = util;
  }
})();
