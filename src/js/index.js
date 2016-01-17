$(document).ready(() => {
  'use strict';
  const generator = egamaxflow.graph.generator;
  const sigmaSettings = egamaxflow.sigmaSettings;
  const graphSettings = egamaxflow.graphSettings;
  const algorithms = {
    1: egamaxflow.algorithm.fordFulkerson,
    2: egamaxflow.algorithm.edmondsKarp,
    3: egamaxflow.algorithm.dinic,
    4: egamaxflow.algorithm.preflowPush
  };
  const algorithmNames = {
    1: 'Ford-Fulkerson',
    2: 'Edmonds-Karp',
    3: 'Dinic',
    4: 'Preflow-Push'
  };
  const dfs = egamaxflow.algorithm.graphTraversal.init(egamaxflow.structure.stack.create());


  let graph = generator.create(graphSettings.NUMBER_OF_VERTICES, graphSettings.MAX_CAPACITY).run();
  graph.nodes = graph.vertices;
  graph.edges = graph.arcs;

  let activeAlgorithm;
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
    outputList.children('li').remove();

    // Reset log
    log = [];

    // Reset all arc colors
    graph.arcs.forEach((arc) => {arc.color = sigmaSettings.EDGE_COLOR;});

    // Reset graph
    graph.reset();
    s.graph.clear();
    s.graph.read(graph);
    s.refresh();

    // Set active algorithm
    activeAlgorithm = algorithmNames[algorithm]

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

    if (result.done) {
      // Update UI
      inputAlgorithm.show();
      lblAlgorithm.text('Algorithm');
      btnNext.hide();
      btnStart.show();

      // Highlight all arcs with flow > 0
      graph.arcs.forEach((arc) => {
        if (arc.flow > 0) {
          arc.color = sigmaSettings.EDGE_ACTIVE_COLOR;
        } else {
          arc.color = sigmaSettings.EDGE_COLOR;
        }
      });

      // Calculate max flow
      let maxFlow = graph.source.outgoingArcs.reduce((sum, arc) => {
        return sum + arc.flow - arc.reverse.flow;
      }, 0);

      outputList.append('<li>Maximum flow = ' + maxFlow + '</li>');
      outputList.append('<li>All arcs with flow > 0 are highlighted.</li>');
    } else {
      if (activeAlgorithm === 'Dinic') {
        // Highlight level graph
        graph.arcs.forEach((arc) => {
          let onLevelGraph = output.levelGraph.arcs.some((a) => {
            return a.equals(arc);
          });

          if (onLevelGraph) {
            arc.color = sigmaSettings.EDGE_ACTIVE_COLOR;

            let onBlockingFlow = output.blockingFlow.arcs.some((a) => {
              return a.equals(arc);
            });

            if (onBlockingFlow) {
              arc.color = sigmaSettings.EDGE_HIGHLIGHT_COLOR;
            }
          } else {
            arc.color = sigmaSettings.EDGE_COLOR;
          }
        });

      } else if (activeAlgorithm === 'Preflow-Push') {
        // Update vertex labels and reset vertex colors
        graph.vertices.forEach((vertex) => {
          vertex.label = vertex.id + ' (d = ' + vertex.distance + ', e = ' + vertex.excess + ')';
          vertex.color = sigmaSettings.NODE_COLOR;
        });

        // Reset arc colors
        graph.arcs.forEach((arc) => {
          arc.color = sigmaSettings.EDGE_COLOR;
        });

        // Highlight active element
        switch (output.step) {
          case 'push':
            output.activeElement.color = sigmaSettings.EDGE_ACTIVE_COLOR;
            break;
          case 'relabel':
            output.activeElement.color = sigmaSettings.NODE_ACTIVE_COLOR;
            break;
          default:
        }

        // Mark saturated cut
        let dfsTraversal = dfs(graph, graph.source);
        let dfsTraversalResult = dfsTraversal.next();

        while (!dfsTraversalResult.done) {
          dfsTraversalResult.value.currentVertex.outgoingArcs.filter((arc) => {
            return arc.capacity === 0;
          }).forEach((arc) => {
            arc.color = sigmaSettings.EDGE_HIGHLIGHT_COLOR;
          });

          dfsTraversalResult = dfsTraversal.next();
        }

        // Reset dfs traversal flags
        graph.vertices.forEach((vertex) => {
          vertex.currentArcIndex = -1;
          vertex.seen = false;
          vertex.finished = false;
        });
      } else {
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
        console.log(output.flowAugmentingPath.map((arc) => {return arc.from.id + " -> " + arc.to.id}));
      }

    }


    // Redraw
    s.graph.clear();
    s.graph.read(graph);
    s.refresh();
  });

});
