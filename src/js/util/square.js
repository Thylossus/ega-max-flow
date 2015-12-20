const range = require('lodash/utility/range');

(function () {
  'use strict';

  exports.separate = (gridSize, numberOfQuadrants) => {
    // Check if numberOfQuadrants is a square.
    // If it is a square, proceed. Otherwise, calculate the next larger square number.
    let numberOfSegments = Math.ceil(Math.sqrt(numberOfQuadrants))
    let segmentSize = Math.floor(gridSize / numberOfSegments);
    numberOfQuadrants = numberOfSegments * numberOfSegments;

    let quadrants = range(numberOfQuadrants).map((qNum) => {
      let next = (qNum + 1);
      let x1 = segmentSize * (qNum % numberOfSegments);
      let x2 = x1 + segmentSize;
      let y1 = segmentSize * Math.floor(qNum / numberOfSegments);
      let y2 = y1 + segmentSize;

      return {
        id: qNum,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
      };
    });

    return {
      quadrants: quadrants,
      numberOfQuadrants: numberOfQuadrants,
      numberOfSegments: numberOfSegments
    };
  };
})();
