'use strict';

const chai = require('chai');
const expect = chai.expect;

const calculation = require('../../src/js/util/calculation');
const arc = require('../../src/js/graph/arc');
const vertex = require('../../src/js/graph/vertex');

describe('Calculation', () => {

  describe('#intersect', () => {
    it('should return true for intersecting line segments', () => {
      var segmentA = {
        from: {
          x: 0,
          y: 0
        },
        to: {
          x: 3,
          y: 3
        }
      };

      var segmentB = {
        from: {
          x: 0,
          y: 3
        },
        to: {
          x: 3,
          y: 0
        }
      };

      expect(calculation.intersect(segmentA, segmentB)).to.be.true;
    });

    it('should return false for non-intersecting line segments', () => {
      var segmentA = {
        from: {
          x: 0,
          y: 0
        },
        to: {
          x: 3,
          y: 1
        }
      };

      var segmentB = {
        from: {
          x: 0,
          y: 3
        },
        to: {
          x: 3,
          y: 2
        }
      };

      expect(calculation.intersect(segmentA, segmentB)).to.be.false;
    });

    it('should return true for overlapping line segments', () => {
      var segmentA = {
        from: {
          x: 0,
          y: 0
        },
        to: {
          x: 3,
          y: 3
        }
      };

      var segmentB = {
        from: {
          x: 2,
          y: 2
        },
        to: {
          x: 4,
          y: 4
        }
      };

      expect(calculation.intersect(segmentA, segmentB)).to.be.true;
    });

    it('should return false for collinear but non-overlapping line segments', () => {
      var segmentA = {
        from: {
          x: 0,
          y: 0
        },
        to: {
          x: 3,
          y: 3
        }
      };

      var segmentB = {
        from: {
          x: 4,
          y: 4
        },
        to: {
          x: 5,
          y: 5
        }
      };

      expect(calculation.intersect(segmentA, segmentB)).to.be.false;
    });

    it('should return false for parallel line segments', () => {
      var segmentA = {
        from: {
          x: 0,
          y: 0
        },
        to: {
          x: 3,
          y: 3
        }
      };

      var segmentB = {
        from: {
          x: 0,
          y: 1
        },
        to: {
          x: 3,
          y: 4
        }
      };

      expect(calculation.intersect(segmentA, segmentB)).to.be.false;
    });

    it('should return false for line segments that have a common start and end point', () => {
      var segmentA = {
        from: {
          x: 0,
          y: 0
        },
        to: {
          x: 3,
          y: 3
        }
      };

      var segmentB = {
        from: {
          x: 3,
          y: 3
        },
        to: {
          x: 3,
          y: 4
        }
      };

      expect(calculation.intersect(segmentA, segmentB)).to.be.false;
    });

    it('should return false for line segments which only differ by their direction', () => {
      var segmentA = {
        from: {
          x: 0,
          y: 0
        },
        to: {
          x: 3,
          y: 3
        }
      };

      var segmentB = {
        from: {
          x: 3,
          y: 3
        },
        to: {
          x: 0,
          y: 0
        }
      };

      expect(calculation.intersect(segmentA, segmentB)).to.be.false;
    });
  });

  describe('#equalPosition', () => {
    it ('should return true for vertices at the same position', () => {
      let v = vertex.create();

      expect(calculation.equalPosition(v, v)).to.be.true;
    });

    it ('should return false for vertices at different positions', () => {
      let v1 = vertex.create();
      let v2;

      do {
        v2 = vertex.create();
      } while (v1.x === v2.x && v1.y === v2.y);

      expect(calculation.equalPosition(v1, v2)).to.be.false;
    });
  });

  describe('#euclidianDistance', () => {

    it('should return 0 for the same node', () => {
      let v = vertex.create();

      expect(calculation.euclidianDistance(v, v)).to.equal(0);
    });

    it('should return > 0 for two distinct vertices', () => {
      let v1 = vertex.create();
      let v2;

      do {
        v2 = vertex.create();
      } while (calculation.equalPosition(v1, v2));


      expect(calculation.euclidianDistance(v1, v2)).to.be.above(0);
    });

    it('should return the correct results', () => {
      let a = {x: 0, y: 0};
      let b = {x: 3, y: 4};

      expect(calculation.euclidianDistance(a, b)).to.equal(5);

      for (var i = 1; i < 100; i++) {
        expect(calculation.euclidianDistance(a, {x: 0, y: i})).to.equal(i);
        expect(calculation.euclidianDistance(a, {x: i, y: 0})).to.equal(i);
      }
    });

    describe('parameter checks', () => {
      it('should throw an error for two missing parameters', () => {
        let edNoParameters = calculation.euclidianDistance.bind(null);

        expect(edNoParameters).to.throw(Error);
        expect(edNoParameters).to.throw(/missing parameter/i);
      });

      it('should throw an error for a single missing parameters', () => {
        let edOneParameter = calculation.euclidianDistance.bind(null, {});

        expect(edOneParameter).to.throw(Error);
        expect(edOneParameter).to.throw(/missing parameter/i);
      });

      it('should throw an error for incorrect parameters', () => {
        let edNonVertexParameters = calculation.euclidianDistance.bind(null, {}, {});

        expect(edNonVertexParameters).to.throw(Error);
        expect(edNonVertexParameters).to.throw(/not a vertex/);
      });

      it('should throw an error for an incorrect first parameter', () => {
        let v = vertex.create();
        let edWrongFirstParameter = calculation.euclidianDistance.bind(null, {}, v);

        expect(edWrongFirstParameter).to.throw(Error);
        expect(edWrongFirstParameter).to.throw(/first argument is not a vertex/);
      });

      it('should throw an error for an incorrect second parameter', () => {
        let v = vertex.create();
        let edWrongSecondParameter = calculation.euclidianDistance.bind(null, v, {});

        expect(edWrongSecondParameter).to.throw(Error);
        expect(edWrongSecondParameter).to.throw(/second argument is not a vertex/);
      });

      it('should throw not throw an error for correct parameters', () => {
        let v1 = vertex.create();
        let v2 = vertex.create();
        let edCorrectParameters = calculation.euclidianDistance.bind(null, v1, v2);

        expect(edCorrectParameters).to.not.throw(Error);
      });
    });
  });

});
