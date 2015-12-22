const generator = egamaxflow.graph.generator;
const sigmaSettings = egamaxflow.sigmaSettings;

(function () {
  'use strict';


  let graph = generator.create(10, 100).run();
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

})();
