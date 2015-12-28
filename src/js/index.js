$(document).ready(() => {
  'use strict';
  const generator = egamaxflow.graph.generator;
  const sigmaSettings = egamaxflow.sigmaSettings;
  const graphSettings = egamaxflow.graphSettings;
  const algorithms = {
    1: egamaxflow.algorithm.fordFulkerson,
    2: null,
    3: null,
    4: null
  };
  const algorithmNames = {
    1: 'Ford-Fulkerson',
    2: 'Edmonds-Karp',
    3: 'Dinic',
    4: 'Preflow-Push'
  };


  let graph = generator.create(graphSettings.NUMBER_OF_VERTICES, graphSettings.MAX_CAPACITY).run();
  graph.nodes = graph.vertices;
  graph.edges = graph.arcs;

  let iterator;
  let log = [];

  // console.log('arcs', graph.arcs.map((arc) => {return arc.id + '(' + arc.from.id + ' -' + arc.capacity + '-> ' + arc.to.id + ')'}));

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

  // Create references to UI elements
  let btnStart = $('#start');
  let btnNext = $('#next');
  let inputAlgorithm = $('#algorithm');
  let lblAlgorithm = $('#labelAlgorithm');
  let containerOutput = $('#output');
  let outputList = $('#output > ul');

  btnStart.on('click', (e) => {
    e.preventDefault();

    let algorithm = inputAlgorithm.val();

    if (!algorithms.hasOwnProperty(algorithm)) {
      throw new Error('Unsupported algorithm');
    }

    // Update UI
    inputAlgorithm.hide();
    lblAlgorithm.text(algorithmNames[algorithm]);
    btnStart.hide();
    btnNext.show();
    containerOutput.show();

    // Reset graph
    graph.reset();
    s.graph.clear();
    s.graph.read(graph);
    s.refresh();

    // Initialize algorithm
    algorithm = algorithms[algorithm];
    iterator = algorithm.init(graph);

  });

  btnNext.on('click', (e) => {
    e.preventDefault();

    if (!iterator) {
      throw new Error('Iterator undefined');
    }

    let result = iterator.next();
    let output = result.value;

    // Highlight flow augmenting path
    graph.arcs.forEach((arc) => {
      let onPath = output.flowAugmentingPath.some((a) => {
        return a.equals(arc);
      });

      if (onPath) {
        arc.color = sigmaSettings.EDGE_ACTIVE_COLOR;
      } else {
        arc.color = sigmaSettings.EDGE_COLOR;
      }
    });

    // Log augmenting path
    let path = output.flowAugmentingPath[0].from.id;
    path = output.flowAugmentingPath.reduce((p, arc) => {
      return p + ' > ' + arc.to.id;
    }, path);
    log.push(path);

    // Log to list
    outputList.html('');
    log.forEach((entry) => {
      outputList.append('<li>' + entry + '</li>');
    });

    console.log(output);
    if (result.done) {
      console.log('finished');
    }

    // Redraw
    s.graph.clear();
    s.graph.read(graph);
    s.refresh();
  });

});
