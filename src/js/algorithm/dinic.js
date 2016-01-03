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
        // TODO: construct a level graph with its arcs in a doubly linked list for O(1) deletion of arcs and vertices; implement the special dfs for dinic dfs
        // http://wiki.algo.informatik.tu-darmstadt.de/Blocking_flow_by_Dinic
        // http://math.mit.edu/~rpeng/18434/blockingFlows.pdf
        // https://github.com/andrewrjones/doubly-linked-list-js
        // https://en.wikipedia.org/wiki/Dinic%27s_algorithm
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
