/*
https://en.wikipedia.org/wiki/Marching_squares
*/

class Node {
  x;
  y;
  equal = v => {
    if (v.x !== this.x) {
      return false;
    }
    if (v.y !== this.y) {
      return false;
    }
    return true;
  };
}

class ControlNode extends Node {
  value;
  active;
  constructor(x, y, value, active) {
    super();
    this.x = x;
    this.y = y;
    this.value = value;
    this.active = active;
  }
}

class Square {
  constructor(topLeft, topRight, bottomRight, bottomLeft, threshold) {
    this.topLeft = topLeft;
    this.topRight = topRight;
    this.bottomLeft = bottomLeft;
    this.bottomRight = bottomRight;

    this.threshold = threshold;

    this.configuration = 0;
    if (this.topLeft.active) {
      this.configuration += 8;
    }
    if (this.topRight.active) {
      this.configuration += 4;
    }
    if (this.bottomRight.active) {
      this.configuration += 2;
    }
    if (this.bottomLeft.active) {
      this.configuration += 1;
    }
  }

  averageData = () => {
    return (
      (this.bottomLeft.value +
        this.bottomRight.value +
        this.topRight.value +
        this.topLeft.value) /
      4
    );
  };

  //P = P1 + (isovalue - V1)(P2-P1)/(V2-V1)
  // p1 is the node below the threshold
  interpolate = (p1, p2, v1, v2, threshold) => {
    return p1 + (threshold - v1) * (p2 - p1) / (v2 - v1);
  };

  interpolateX = (p1, p2) => {
    return this.interpolate(p1.x, p2.x, p1.value, p2.value, this.threshold);
  };

  interpolateY = (p1, p2) => {
    return this.interpolate(p1.y, p2.y, p1.value, p2.value, this.threshold);
  };

  centrePoints = caseIndex => {
    let top = null;
    let right = null;
    let bottom = null;
    let left = null;

    switch (caseIndex) {
      // 0 point
      case 0:
        break;
      // 1 point
      case 1:
        bottom = new Node();
        bottom.x = this.interpolateX(this.bottomRight, this.bottomLeft);
        bottom.y = this.bottomLeft.y;

        left = new Node();
        left.x = this.bottomLeft.x;
        left.y = this.interpolateY(this.topLeft, this.bottomLeft);
        break;
      case 2:
        right = new Node();
        right.x = this.bottomRight.x;
        right.y = this.interpolateY(this.topRight, this.bottomRight);

        bottom = new Node();
        bottom.x = this.interpolateX(this.bottomLeft, this.bottomRight);
        bottom.y = this.bottomLeft.y;
        break;

      case 4:
        top = new Node();
        top.x = this.interpolateX(this.topLeft, this.topRight);
        top.y = this.topLeft.y;

        right = new Node();
        right.x = this.bottomRight.x;
        right.y = this.interpolateY(this.bottomRight, this.topRight);

        break;

      case 8:
        top = new Node();
        top.x = this.interpolateX(this.topRight, this.topLeft);
        top.y = this.topLeft.y;

        left = new Node();
        left.x = this.bottomLeft.x;
        left.y = this.interpolateY(this.bottomLeft, this.topLeft);
        break;

      // 2 points
      case 3:
        right = new Node();
        right.x = this.bottomRight.x;
        right.y = this.interpolateY(this.topRight, this.bottomRight);

        left = new Node();
        left.x = this.bottomLeft.x;
        left.y = this.interpolateY(this.topLeft, this.bottomLeft);

        break;

      case 6:
        top = new Node();
        top.x = this.interpolateX(this.topLeft, this.topRight);
        top.y = this.topLeft.y;

        bottom = new Node();
        bottom.x = this.interpolateX(this.bottomLeft, this.bottomRight);
        bottom.y = this.bottomLeft.y;

        break;

      case 9:
        top = new Node();
        top.x = this.interpolateX(this.topRight, this.topLeft);
        top.y = this.topLeft.y;

        bottom = new Node();
        bottom.x = this.interpolateX(this.bottomRight, this.bottomLeft);
        bottom.y = this.bottomLeft.y;
        break;

      case 12:
        right = new Node();
        right.x = this.bottomRight.x;
        right.y = this.interpolateY(this.bottomRight, this.topRight);

        left = new Node();
        left.x = this.bottomLeft.x;
        left.y = this.interpolateY(this.bottomLeft, this.topLeft);
        break;

      case 5:
        top = new Node();
        top.x = this.interpolateX(this.topLeft, this.topRight);
        top.y = this.topLeft.y;

        right = new Node();
        right.x = this.bottomRight.x;
        right.y = this.interpolateY(this.bottomRight, this.topRight);

        bottom = new Node();
        bottom.x = this.interpolateX(this.bottomRight, this.bottomLeft);
        bottom.y = this.bottomLeft.y;

        left = new Node();
        left.x = this.bottomLeft.x;
        left.y = this.interpolateY(this.topLeft, this.bottomLeft);

        break;

      case 10:
        top = new Node();
        top.x = this.interpolateX(this.topRight, this.topLeft);
        top.y = this.topLeft.y;

        right = new Node();
        right.x = this.bottomRight.x;
        right.y = this.interpolateY(this.topRight, this.bottomRight);

        bottom = new Node();
        bottom.x = this.interpolateX(this.bottomLeft, this.bottomRight);
        bottom.y = this.bottomLeft.y;

        left = new Node();
        left.x = this.bottomLeft.x;
        left.y = this.interpolateY(this.bottomLeft, this.topLeft);
        break;

      // 3 points
      case 7:
        top = new Node();
        top.x = this.interpolateX(this.topLeft, this.topRight);
        top.y = this.topLeft.y;

        left = new Node();
        left.x = this.bottomLeft.x;
        left.y = this.interpolateY(this.topLeft, this.bottomLeft);
        break;
      case 11:
        top = new Node();
        top.x = this.interpolateX(this.topRight, this.topLeft);
        top.y = this.topLeft.y;

        right = new Node();
        right.x = this.bottomRight.x;
        right.y = this.interpolateY(this.topRight, this.bottomRight);
        break;
      case 13:
        right = new Node();
        right.x = this.bottomRight.x;
        right.y = this.interpolateY(this.bottomRight, this.topRight);

        bottom = new Node();
        bottom.x = this.interpolateX(this.bottomRight, this.bottomLeft);
        bottom.y = this.bottomLeft.y;
        break;
      case 14:
        bottom = new Node();
        bottom.x = this.interpolateX(this.bottomLeft, this.bottomRight);
        bottom.y = this.bottomLeft.y;

        left = new Node();
        left.x = this.bottomLeft.x;
        left.y = this.interpolateY(this.bottomLeft, this.topLeft);

        break;

      // 4 points:
      case 15:
        break;
      default:
        break;
    }

    return [top, right, bottom, left];
  };

  flip = caseIndex => {
    if (caseIndex !== 5 && caseIndex !== 10) {
      return caseIndex;
    }
    if (caseIndex === 5) {
      let average = this.averageData();
      if (average < this.threshold) {
        return 10;
      }
    }
    if (caseIndex === 10) {
      let average = this.averageData();
      if (average < this.threshold) {
        return 5;
      }
    }
    return caseIndex;
  };

  contours = () => {
    let result = [];
    let caseIndex = this.configuration;
    if (this.configuration === 0 || this.configuration === 15) {
      return result;
    }
    let centre = this.centrePoints(caseIndex);
    caseIndex = this.flip(caseIndex);
    if (caseIndex === 5) {
      let l1 = [centre[0], centre[3]];
      result.push(l1);
      let l2 = [centre[1], centre[2]];
      result.push(l2);
    } else if (caseIndex === 10) {
      let l1 = [centre[0], centre[1]];
      result.push(l1);
      let l2 = [centre[2], centre[3]];
      result.push(l2);
    } else {
      let l = [];
      for (let i = 0; i < centre.length; i++) {
        if (centre[i] === null) {
          continue;
        }
        l.push(centre[i]);
      }
      result.push(l);
    }
    return result;
  };
}

export default class MarchingSquares {
  constructor(data, threshold, resolution) {
    this.data = data;
    this.threshold = threshold;
    this.resolution = resolution;
  }

  getContourLine = () => {
    let r = this.resolution;
    let rows = this.data.length / r - 1;
    let cols = this.data[0].length / r - 1;

    let result = [];

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        let bl = this.data[r * j][r * i];
        let br = this.data[r * j][r * i + r];
        let tr = this.data[r * j + r][r * i + r];
        let tl = this.data[r * j + r][r * i];

        if (isNaN(tl) || isNaN(tr) || isNaN(bl) || isNaN(br)) {
          continue;
        }
        let bottomLeft = new ControlNode(
          r * i,
          r * j,
          bl,
          bl >= this.threshold
        );
        let bottomRight = new ControlNode(
          r * i + r,
          r * j,
          br,
          br >= this.threshold
        );
        let topRight = new ControlNode(
          r * i + r,
          r * j + r,
          tr,
          tr >= this.threshold
        );
        let topLeft = new ControlNode(
          r * i,
          r * j + r,
          tl,
          tl >= this.threshold
        );
        let square = new Square(
          topLeft,
          topRight,
          bottomRight,
          bottomLeft,
          this.threshold
        );
        let c = square.contours();
        if (c.length === 0) {
          continue;
        }
        for (let i = 0; i < c.length; i++) {
          result.push(c[i]);
        }
      }
    }
    return result;
  };
}
