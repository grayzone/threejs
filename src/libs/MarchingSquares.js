/*
https://en.wikipedia.org/wiki/Marching_squares
*/

class Node {
  x;
  y;
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
  constructor(data, threshold) {
    this.data = data;
    this.threshold = threshold;
  }

  getContourLine = () => {
    let rows = this.data.length - 1;
    let cols = this.data[0].length - 1;

    let result = [];

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        let bl = this.data[j][i];
        let br = this.data[j][i + 1];
        let tr = this.data[j + 1][i + 1];
        let tl = this.data[j + 1][i];

        if (isNaN(tl) || isNaN(tr) || isNaN(bl) || isNaN(br)) {
          continue;
        }
        let bottomLeft = new ControlNode(i, j, bl, bl >= this.threshold);
        let bottomRight = new ControlNode(i + 1, j, br, br >= this.threshold);
        let topRight = new ControlNode(i + 1, j + 1, tr, tr >= this.threshold);
        let topLeft = new ControlNode(i, j + 1, tl, tl >= this.threshold);
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

/*
// 2D ISO lines
export default class MarchingSquares {
  constructor(object, data, resolution, threshold) {
    //     this.getVertex(position.x, position.y, position.z, resolution);
    //    this.getMidPoint(position.x, position.y, position.z, resolution);
    this.object = object;
    this.threshold = threshold;
    this.data = data;
    this.resolution = resolution;
  }

  computeContourGrid = (data, threshold) => {
    let rows = data.length - 1;
    let cols = data[0].length - 1;
    let contourGrid = {
      rows: rows,
      cols: cols,
      cells: []
    };
    for (let j = 0; j < rows; j++) {
      contourGrid.cells[j] = [];
      for (let i = 0; i < cols; i++) {
        let bl = data[j][i];
        let br = data[j][i + 1];
        let tr = data[j + 1][i + 1];
        let tl = data[j + 1][i];

        if (isNaN(tl) || isNaN(tr) || isNaN(bl) || isNaN(br)) {
          continue;
        }
        let cval = 0;
        cval |= bl >= threshold ? 1 : 0;
        cval |= br >= threshold ? 2 : 0;
        cval |= tr >= threshold ? 4 : 0;
        cval |= tl >= threshold ? 8 : 0;

        var flipped = false;
        if (cval === 5 || cval === 10) {
          var average = (bl + br + tr + tl) / 4;
          if (cval === 5 && average < threshold) {
            cval = 10;
            flipped = true;
          } else if (cval === 5 && average < threshold) {
            cval = 5;
            flipped = true;
          }
        }

        if (cval === 0 || cval === 15) {
          continue;
        }

        let top = 0.5;
        let bottom = 0.5;
        let left = 0.5;
        let right = 0.5;
        switch (cval) {
          case 1:
            break;
          case 2:
            break;
          case 3:
            break;
          case 4:
            break;
          case 5:
            break;
          case 6:
            break;
          case 7:
            break;
          case 8:
            break;
          case 9:
            break;
          case 10:
            break;
          case 11:
            break;
          case 12:
            break;
          case 13:
            break;
          case 14:
            break;
          default:
            break;
        }
      }
    }
  };

  
  getVertex = (x, y, z, length) => {
    this.vertex = [
      new THREE.Vector3(x, y, z),
      new THREE.Vector3(x + length, y, z),
      new THREE.Vector3(x + length, y + length, z),
      new THREE.Vector3(x, y + length, z)
    ];
  };

  getMidPoint = (x, y, z, length) => {
    this.midPoint = [
      new THREE.Vector3(x + length / 2, y, z),
      new THREE.Vector3(x + length, y + length / 2, z),
      new THREE.Vector3(x + length / 2, y + length, z),
      new THREE.Vector3(x, y + length / 2, z)
    ];
  };
  

  interpolate = (x, start, end) => {
    return (x - start) / (start - end);
  };

  // -------------------v1-----------v---------------v2-------------
  getIntero = (start, end) => {
    return this.resolution * (start - this.iso) / (start - end);
  };

  getMiddlePoint = (v, e) => {
    let p = this.vertex[v];
    let result = { x: 0, y: 0, z: p.z };
    if (v === 0 && e === 0) {
      result.y = p.y;
      result.x = p.x + this.getIntero(this.data[0], this.data[1]);
      return result;
    }
    if (v === 0 && e === 3) {
      result.x = p.x;
      result.y = p.y + this.getIntero(this.data[0], this.data[3]);
      return result;
    }
    if (v === 1 && e === 0) {
      result.y = p.y;
      result.x = p.x - this.getIntero(this.data[1], this.data[0]);
      return result;
    }
    if (v === 1 && e === 1) {
      result.x = p.x;
      result.y = p.y + this.getIntero(this.data[1], this.data[2]);
      return result;
    }
    if (v === 2 && e === 1) {
      result.x = p.x;
      result.y = p.y - this.getIntero(this.data[2], this.data[1]);
      return result;
    }
    if (v === 2 && e === 2) {
      result.y = p.y;
      result.x = p.x - this.getIntero(this.data[2], this.data[3]);
      return result;
    }
    if (v === 3 && e === 2) {
      result.y = p.y;
      result.x = p.x + this.getIntero(this.data[3], this.data[2]);
      return result;
    }
    if (v === 3 && e === 3) {
      result.x = p.x;
      result.y = p.y - this.getIntero(this.data[3], this.data[0], this.iso);
      return result;
    }
    return result;
  };

  addIntersection = vertices => {
    let geo = new THREE.Geometry();
    geo.vertices = vertices;
    let material = new THREE.LineBasicMaterial({
      color: 0xffaa00
    });
    let line = new THREE.Line(geo, material);
    this.object.add(line);
  };

  checkISO = data => {
    this.result = 0;
    if (data[0] > this.iso) {
      this.result |= 1;
    }
    if (data[1] > this.iso) {
      this.result |= 2;
    }
    if (data[2] > this.iso) {
      this.result |= 4;
    }
    if (data[3] > this.iso) {
      this.result |= 8;
    }
  };

  render() {
    this.checkISO(this.data);
    this.cases(this.result);
  }

  cases = index => {
    let intersects = [];
    let start = null;
    let end = null;
    switch (index) {
      case 0:
        // 0000
        break;
      case 1:
        // 0001
        start = this.getMiddlePoint(0, 0);
        end = this.getMiddlePoint(0, 3);
        intersects = [start, end];
        this.addIntersection(intersects);
        break;
      case 2:
        // 0010
        start = this.getMiddlePoint(1, 0);
        end = this.getMiddlePoint(1, 1);
        intersects = [start, end];
        this.addIntersection(intersects);
        break;
      case 3:
        // 0011
        start = this.getMiddlePoint(0, 3);
        end = this.getMiddlePoint(1, 1);
        intersects = [start, end];
        this.addIntersection(intersects);
        break;
      case 4:
        // 0100
        start = this.getMiddlePoint(2, 1);
        end = this.getMiddlePoint(2, 2);
        intersects = [start, end];
        this.addIntersection(intersects);
        break;
      case 5:
        // 0101
        start = this.getMiddlePoint(0, 0);
        end = this.getMiddlePoint(0, 3);
        intersects = [start, end];
        this.addIntersection(intersects);

        start = this.getMiddlePoint(2, 1);
        end = this.getMiddlePoint(2, 2);
        intersects = [start, end];
        this.addIntersection(intersects);
        break;
      case 6:
        // 0110
        start = this.getMiddlePoint(1, 0);
        end = this.getMiddlePoint(2, 2);
        intersects = [start, end];
        this.addIntersection(intersects);
        break;
      case 7:
        // 0111
        start = this.getMiddlePoint(3, 2);
        end = this.getMiddlePoint(3, 3);
        intersects = [start, end];
        this.addIntersection(intersects);
        break;
      case 8:
        // 1000
        start = this.getMiddlePoint(3, 3);
        end = this.getMiddlePoint(3, 2);
        intersects = [start, end];
        this.addIntersection(intersects);
        break;
      case 9:
        // 1001
        start = this.getMiddlePoint(0, 0);
        end = this.getMiddlePoint(3, 2);
        intersects = [start, end];
        this.addIntersection(intersects);
        break;
      case 10:
        // 1010
        start = this.getMiddlePoint(1, 0);
        end = this.getMiddlePoint(3, 3);
        intersects = [start, end];
        this.addIntersection(intersects);

        start = this.getMiddlePoint(1, 1);
        end = this.getMiddlePoint(3, 2);
        intersects = [start, end];
        this.addIntersection(intersects);
        break;
      case 11:
        // 1011
        start = this.getMiddlePoint(1, 1);
        end = this.getMiddlePoint(3, 2);
        intersects = [start, end];
        this.addIntersection(intersects);
        break;
      case 12:
        // 1100
        start = this.getMiddlePoint(2, 1);
        end = this.getMiddlePoint(3, 3);
        intersects = [start, end];
        this.addIntersection(intersects);
        break;
      case 13:
        // 1101
        start = this.getMiddlePoint(0, 0);
        end = this.getMiddlePoint(2, 1);
        intersects = [start, end];
        this.addIntersection(intersects);
        break;
      case 14:
        // 1110
        start = this.getMiddlePoint(1, 0);
        end = this.getMiddlePoint(3, 3);
        intersects = [start, end];
        this.addIntersection(intersects);
        break;
      case 15:
        // 1111
        break;
      default:
        break;
    }
  };
}
*/
