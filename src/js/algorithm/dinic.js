const graphTraversal = require('./graphTraversal');
const queue = require('../structure/queue');

(function() {
  'use strict';

  function buildLevelGraph(graph) {
    let bfsTraversal = graphTraversal.init(queue.create(), graph);

    let output = null;
    let result = bfsTraversal.next();
    let last;

    while (!result.done) {
      output = result.value;
      if (output.currentArc && output.currentArc.level) {
        
        console.log(output.currentArc.from.id + ' -> ' + output.currentArc.to.id);
      }
      result = bfsTraversal.next();
    }
  }

  function* iterator(graph) {
    buildLevelGraph(graph);
  }

  exports.init = (graph) => {
    return iterator(graph);
  };

  // exports.run = (iterator) => {
  //   let output = null;
  //   let result = iterator.next();
  //
  //   while (!result.done) {
  //     output = result.value;
  //     result = iterator.next();
  //   }
  //
  //   return output;
  // };
}());
