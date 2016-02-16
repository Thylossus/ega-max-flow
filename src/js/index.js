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
  const testEnv = egamaxflow.testEnv;


  let graph;

  let activeAlgorithm;
  let iterator;
  let log = [];

  // Sigma.js instance
  let s;

  // Create references to UI elements
  let btnSelect = $('#select');
  let btnNext = $('#next');
  let btnPlay = $('#play');
  let btnPlayLabel = btnPlay.children('span').first();
  let btnRunTest = $('#runTest');
  let btnDownloadResults = $('#downloadResults');
  let btnCancelTest = $('#cancelTest');
  let inputSpeed = $('#speed');
  let inputAlgorithm = $('#algorithm');
  let lblAlgorithm = $('#labelAlgorithm');
  let inputGraphSettingsVertices = $('#graphSettingsVertices');
  let inputGraphSettingsMaxCapacity = $('#graphSettingsMaxCapacity');
  let inputGraphSettingsOrdered = $('#graphSettingsOrdered');
  let inputTestEnvInstances = $('#testEnvInstances');
  let inputTestEnvVertices = $('#testEnvVertices');
  let inputTestEnvMaxCapacity = $('#testEnvMaxCapacity');
  let inputTestEnvVerbose = $('#testEnvVerbose');
  let containerOutput = $('#output');
  let outputList = $('#output > ol');
  let exFordFulkerson = $('#exFordFulkerson');
  let exEdmondsKarp = $('#exEdmondsKarp');
  let exDinic = $('#exDinic');
  let exPreflowPush = $('#exPreflowPush');
  let outputResult = $('#outputResult');
  let algorithmSelection = $('#algorithmSelection');
  let algorithmCtrl = $('#algorithmCtrl');
  let runSettings = $('#runSettings');
  let runProgress = $('#runProgress');
  let runResult = $('#runResult');

  let playing = false;
  let speed = 1000;

  let resultString;

  let clearVertexLabels = function clearVertexLabels() {
    // Remove vertex labels
    graph.vertices.forEach((vertex) => {
      vertex.label = '';
    });
  };

  let printLogToList = function printLogToList() {
    outputList.html('');
    log.forEach((entry) => {
      outputList.append('<li>' + entry + '</li>');
    });

    // Scroll to bottom of list
    containerOutput.scrollTop(containerOutput[0].scrollHeight)
  };

  let init = function init(options) {
    options = options || {};
    options.numberOfVertices = options.numberOfVertices || graphSettings.NUMBER_OF_VERTICES;
    options.maxCapacity = options.maxCapacity || graphSettings.MAX_CAPACITY;

    graph =  generator.create(options.numberOfVertices, options.maxCapacity, options.ordered).run();
    graph.nodes = graph.vertices;
    graph.edges = graph.arcs;

    clearVertexLabels();

    s = new sigma({
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
        drawEdgeLabels: sigmaSettings.EDGE_DISPLAY_LABELS,
        sideMargin: 30
      }
    });
  };

  // Initialize
  init({ordered: true});

  let doIteration = function doIteration() {
    let result = iterator.next();
    let output = result.value;

    if (result.done) {
      // Update UI
      inputAlgorithm.show();
      lblAlgorithm.text('Algorithm');
      algorithmCtrl.hide();
      algorithmSelection.show();
      enableGraphSettings();

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

      outputResult.text(`The maximum flow is ${maxFlow}. All arcs with a flow greater than zero are highlighted.`);

      if (activeAlgorithm !== 'Preflow-Push') {
        clearVertexLabels();
      }

      return true;
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

        // Log flow increment
        let incParts = output.blockingFlow.increments.join(' + ');
        let incSum = output.blockingFlow.increments.reduce((sum, inc) => {
          return sum + inc;
        }, 0);
        log.push(`${incParts} = ${incSum}`);

        // Log to list
        printLogToList();

        clearVertexLabels();

      } else if (activeAlgorithm === 'Preflow-Push') {
        // Mark saturated cut
        let dfsTraversal = dfs(graph, graph.source);
        let dfsTraversalResult = dfsTraversal.next();
        let reachableFromS = {};

        // Reset the current arc index for all vertices in order to perform a proper dfs
        graph.vertices.forEach((vertex) => {
          vertex.currentArcIndex = -1;
        });

        while (!dfsTraversalResult.done) {
          // console.warn(dfsTraversalResult.value.currentVertex.id);
          reachableFromS[dfsTraversalResult.value.currentVertex.id] = dfsTraversalResult.value.currentVertex;

          dfsTraversalResult = dfsTraversal.next();
        }

        // Update vertex labels and set vertex colors
        graph.vertices.forEach((vertex) => {
          // vertex.label = vertex.id + ' (d = ' + vertex.distance + ', e = ' + vertex.excess + ')';
          vertex.label = '' + vertex.distance;
          switch (vertex.type) {
            case graphSettings.VERTEX_TYPE.SOURCE:
              vertex.color = sigmaSettings.SOURCE_COLOR;
              break;
            case graphSettings.VERTEX_TYPE.SINK:
              vertex.color = sigmaSettings.SINK_COLOR;
              break;
            default:
              if (!reachableFromS[vertex.id]) {
                vertex.color = sigmaSettings.NODE_UNREACHABLE_COLOR;
              } else {
                vertex.color = sigmaSettings.NODE_COLOR;
              }
          }

        });

        // Highlight arcs that are part of the saturated cut
        graph.arcs.forEach((arc) => {
          let fromSourceOrReachable = arc.from.equals(graph.source) || reachableFromS[arc.from.id];
          let toUnreachable = !reachableFromS[arc.to.id];

          if (fromSourceOrReachable && toUnreachable) {
            arc.color = sigmaSettings.EDGE_HIGHLIGHT_COLOR;
          } else {
            arc.color = sigmaSettings.EDGE_COLOR;
          }
        });

        // Highlight active element
        switch (output.step) {
          case 'push':
            log.push(`Push: augment flow by ${output.stepInfo}`)
            output.activeElement.color = sigmaSettings.EDGE_ACTIVE_COLOR;
            break;
          case 'relabel':
            log.push(`Relabel: add ${output.activeElement.distance - output.stepInfo}`);
            output.activeElement.color = sigmaSettings.NODE_ACTIVE_COLOR;
            break;
          default:
            // First step
            // Log first step message
            log.push('Saturated arcs incident to the source and computed a valid distance labelling.');
        }

        // Log to list
        printLogToList();

        // Reset dfs traversal flags
        graph.vertices.forEach((vertex) => {
          vertex.currentArcIndex = -1;
          vertex.seen = false;
          vertex.finished = false;
        });
      } else {
        // Ford Fulkerson and Edmonds-Karp
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

        // Log flow increment
        log.push(output.incFlow);

        // Log to list
        printLogToList();

        clearVertexLabels();
      }

    }

    return false;
  };

  let redraw = function redraw() {
    s.graph.clear();
    s.graph.read(graph);
    s.refresh();
  };

  let disable = function disable(element) {
    element.attr('disabled', 'disabled');
  };

  let enable = function enable(element) {
    element.removeAttr('disabled');
  };

  let disableGraphSettings = function disableGraphSettings() {
    disable(inputGraphSettingsVertices);
    disable(inputGraphSettingsMaxCapacity);
    disable(inputGraphSettingsOrdered);
  };

  let enableGraphSettings = function enableGraphSettings() {
    enable(inputGraphSettingsVertices);
    enable(inputGraphSettingsMaxCapacity);
    enable(inputGraphSettingsOrdered);
  };

  let togglePlayPauseBtn = function togglePlayPauseBtn() {
    if (btnPlayLabel.hasClass('glyphicon-play')) {
      btnPlayLabel.removeClass('glyphicon-play');
      btnPlayLabel.addClass('glyphicon-pause');
    } else {
      btnPlayLabel.removeClass('glyphicon-pause');
      btnPlayLabel.addClass('glyphicon-play');
    }
  };

  btnSelect.on('click', (e) => {
    e.preventDefault();

    let algorithm = inputAlgorithm.val();

    if (!algorithms.hasOwnProperty(algorithm)) {
      throw new Error('Unsupported algorithm');
    }

    // Display explanation
    $('.explanation').hide();
    switch (algorithm) {
      case '1':
        exFordFulkerson.show();
        break;
      case '2':
        exEdmondsKarp.show();
        break;
      case '3':
        exDinic.show();
        break;
      case '4':
        exPreflowPush.show();
        break;
    }

    // Update UI
    inputAlgorithm.hide();
    lblAlgorithm.text(algorithmNames[algorithm]);
    algorithmSelection.hide();
    algorithmCtrl.show();
    containerOutput.show();
    outputList.children('li').remove();
    outputResult.text('');
    disableGraphSettings();


    // Reset log
    log = [];

    // Reset all arc colors
    graph.arcs.forEach((arc) => {arc.color = sigmaSettings.EDGE_COLOR;});

    // Reset graph
    graph.reset();
    clearVertexLabels();
    s.graph.clear();
    s.graph.read(graph);
    s.refresh();

    // Set active algorithm
    activeAlgorithm = algorithmNames[algorithm]

    // Initialize algorithm
    algorithm = algorithms[algorithm];
    iterator = algorithm.init(graph);

  });

  btnPlay.on('click', (e) => {
    e.preventDefault();

    if (!iterator) {
      throw new Error('Iterator undefined');
    }

    togglePlayPauseBtn();

    if (playing) {
      enable(btnNext);
      enable(inputSpeed);
      playing = false;
    } else {
      disable(btnNext);
      disable(inputSpeed);
      playing = true;

      let timer = setInterval(() => {
        let finished = doIteration();
        redraw();

        if (finished) {
          enable(btnNext);
          enable(inputSpeed);
          togglePlayPauseBtn();
          playing = false;
        }

        if (!playing) {
          clearInterval(timer);
        }
      }, speed);
    }

  });

  btnNext.on('click', (e) => {
    e.preventDefault();

    if (!iterator) {
      throw new Error('Iterator undefined');
    }

    doIteration();
    redraw();
  });

  btnRunTest.on('click', (e) => {
    e.preventDefault();

    let instances = inputTestEnvInstances.val();
    let vertices = inputTestEnvVertices.val();
    let maxCapacity = inputTestEnvMaxCapacity.val();
    let verbose = inputTestEnvVerbose.prop('checked');
    let start = egamaxflow.moment();

    runSettings.hide();
    runProgress.show();
    disable(btnRunTest);

    let testEnvResult = testEnv(instances, vertices, maxCapacity);

    let end = egamaxflow.moment();

    runProgress.hide();
    runResult.show();
    runResult.text(`Finished test environment run. Started ${start.format('YYYY-MM-DD HH:mm:ss.SSS')} and finished ${end.format('YYYY-MM-DD HH:mm:ss.SSS')}! Click "Download Results" to download the log file.`);
    btnRunTest.hide();
    btnDownloadResults.show();

    resultString = '';

    for (var i = 0; i < testEnvResult.length - 2; i++) {
      let iter = testEnvResult[i];
      if (verbose) {
        iter.forEach((algo) => {
          resultString += algo.toString();
        });
      } else {
        resultString += iter[iter.length - 1].toString();
      }
    }

    // Manipulated iteration
    let manipulatedIteration = testEnvResult[testEnvResult.length - 2];
    resultString += manipulatedIteration.toString();
    // Summary
    let summary = testEnvResult[testEnvResult.length - 1];
    resultString += summary.toString();

  });

  btnDownloadResults.on('click', (e) => {
    e.preventDefault();

    runResult.hide();
    runSettings.show();
    enable(btnRunTest);
    btnRunTest.show();
    btnDownloadResults.hide();

    window.open('data:text/plain,' + encodeURIComponent(resultString));
    resultString = null;

    $('#testEnvModal').modal('hide');
  });

  btnCancelTest.on('click', (e) => {
    e.preventDefault();

    runResult.hide();
    runProgress.hide();
    runSettings.show();

    btnDownloadResults.hide();
    enable(btnRunTest);
    btnRunTest.show();

    $('#testEnvModal').modal('hide');
  });

  inputSpeed.on('change', () => {
    speed = inputSpeed.val();
  });

  $('.graph-settings').on('change', () => {
    let numberOfVertices = inputGraphSettingsVertices.val();
    let maxCapacity = inputGraphSettingsMaxCapacity.val();
    let ordered = inputGraphSettingsOrdered.prop('checked');

    // Delete old graph
    s.graph.clear();
    s.graph.kill();
    $('#container').children().remove();

    init({
      numberOfVertices: numberOfVertices,
      maxCapacity: maxCapacity,
      ordered: ordered
    });
  });

});
