import * as THREE from "three";

export default class MarchingSquares {
  constructor(object, position, resolution, iso, data) {
    this.getVertex(position.x, position.y, position.z, resolution);
//    this.getMidPoint(position.x, position.y, position.z, resolution);
    this.object = object;
    this.iso = iso;
    this.data = data;
    this.resolution = resolution;
  }
  getVertex = (x, y, z, length) => {
    this.vertex = [
      new THREE.Vector3(x, y, z),
      new THREE.Vector3(x + length, y, z),
      new THREE.Vector3(x + length, y + length, z),
      new THREE.Vector3(x, y + length, z)
    ];
  };
  /*
  getMidPoint = (x, y, z, length) => {
    this.midPoint = [
      new THREE.Vector3(x + length / 2, y, z),
      new THREE.Vector3(x + length, y + length / 2, z),
      new THREE.Vector3(x + length / 2, y + length, z),
      new THREE.Vector3(x, y + length / 2, z)
    ];
  };
  */

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
