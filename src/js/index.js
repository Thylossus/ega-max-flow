const generator = egamaxflow.graph.generator;
const sigmaSettings = egamaxflow.sigmaSettings;
const graphSettings = egamaxflow.graphSettings;

(function () {
  'use strict';


  let graph = generator.create(graphSettings.NUMBER_OF_VERTICES, graphSettings.MAX_CAPACITY).run();
  graph.nodes = graph.vertices;
  graph.edges = graph.arcs;

  console.log(graph);

  let s = new sigma({
    graph: graph,
    renderer: {
      container: document.getElementById('container'),
      type: 'canvas'
    },
    settings: {
      edgeLabelSize: 'fixed',
      defaultEdgeLabelSize: sigmaSettings.EDGE_LABEL_SIZE,
      defaultEdgeType: sigmaSettings.EDGE_TYPE,
      defaultEdgeColor: sigmaSettings.EDGE_COLOR,
      drawEdgeLabels: sigmaSettings.EDGE_DISPLAY_LABELS
    }
  });

  let stack = egamaxflow.algorithm.stack.create();
  let traverse = egamaxflow.algorithm.graphTraversal.init(graph, stack);
  let dfsoutput = egamaxflow.algorithm.graphTraversal.run(traverse);

  console.log('lexicographical', dfsoutput.lexicographical.map((vertex) => {return vertex.id;}));
  console.log('parenthetical', dfsoutput.parenthetical.map((vertex) => {return vertex.id;}));

  graph.reset();

  let queue = egamaxflow.algorithm.queue.create();
  traverse = egamaxflow.algorithm.graphTraversal.init(graph, queue);
  let bfsoutput = egamaxflow.algorithm.graphTraversal.run(traverse);

  console.log('lexicographical', bfsoutput.lexicographical.map((vertex) => {return vertex.id;}));
  console.log('parenthetical', bfsoutput.parenthetical.map((vertex) => {return vertex.id;}));

})();
