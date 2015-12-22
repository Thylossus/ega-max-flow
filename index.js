const graph = require('./src/js/graph');
const util = require('./src/js/util');
const sigmaConfig = require('./config/sigma');

(function () {
  'use strict';

  // TODO: think of which tools to expose
  exports.graph = graph;
  exports.util = util;
  exports.sigmaSettings = sigmaConfig;

  if (window) {
    let egamaxflow = window.egamaxflow = {};
    egamaxflow.graph = graph;
    egamaxflow.util = util;
    egamaxflow.sigmaSettings = sigmaConfig; 
  }
})();
