const graph = require('./src/js/graph');
const util = require('./src/js/util');
const algorithm = require('./src/js/algorithm');
const structure = require('./src/js/structure');
const testEnv = require('./src/js/testenv/env.js');
const sigmaConfig = require('./config/sigma');
const graphConfig = require('./config/graph');

(function () {
  'use strict';

  // TODO: think of which tools to expose
  exports.graph = graph;
  exports.util = util;
  exports.algorithm = algorithm;
  exports.structure = structure;
  exports.testEnv = testEnv;
  exports.sigmaSettings = sigmaConfig;
  exports.graphSettings = graphConfig;

  if (window) {
    let egamaxflow = window.egamaxflow = {};
    egamaxflow.graph = graph;
    egamaxflow.util = util;
    egamaxflow.algorithm = algorithm;
    egamaxflow.structure = structure;
    egamaxflow.testEnv = testEnv;
    egamaxflow.sigmaSettings = sigmaConfig;
    egamaxflow.graphSettings = graphConfig;
  }
})();
