import * as THREE from "three";

export default class MarchingSquares {
  constructor(scene, position, resolution, iso, data) {
    console.log("data:", data);
    this.getVertex(position.x, position.y, position.z, resolution);
    this.getMidPoint(position.x, position.y, position.z, resolution);
    this.scene = scene;
    this.iso = iso;
    this.data = data;
  }
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
  addIntersection = vertices => {
    let geo = new THREE.Geometry();
    geo.vertices = vertices;
    let material = new THREE.LineDashedMaterial({
      color: 0xffaa00
    });
    let dashLine = new THREE.Line(geo, material);
    this.scene.add(dashLine);
  };

  checkISO = data => {
    this.result = 0;
    if (data[0] < this.iso) {
      this.result |= 1;
    }
    if (data[1] < this.iso) {
      this.result |= 2;
    }
    if (data[2] < this.iso) {
      this.result |= 4;
    }
    if (data[3] < this.iso) {
      this.result |= 8;
    }
  };

  render() {
    this.checkISO(this.data);
    this.cases(this.result);
  }

  cases = index => {
    let intersects = [];
    switch (index) {
      case 0:
        // 0000
        break;
      case 1:
        // 0001
        intersects = [this.midPoint[0], this.midPoint[3]];
        this.addIntersection(intersects);
        break;
      case 2:
        // 0010
        intersects = [this.midPoint[0], this.midPoint[1]];
        this.addIntersection(intersects);
        break;
      case 3:
        // 0011
        intersects = [this.midPoint[1], this.midPoint[3]];
        this.addIntersection(intersects);
        break;
      case 4:
        // 0100
        intersects = [this.midPoint[1], this.midPoint[2]];
        this.addIntersection(intersects);
        break;
      case 5:
        // 0101
        intersects = [this.midPoint[0], this.midPoint[1]];
        this.addIntersection(intersects);
        intersects = [this.midPoint[2], this.midPoint[3]];
        this.addIntersection(intersects);
        break;
      case 6:
        // 0110
        intersects = [this.midPoint[0], this.midPoint[2]];
        this.addIntersection(intersects);
        break;
      case 7:
        // 0111
        intersects = [this.midPoint[2], this.midPoint[3]];
        this.addIntersection(intersects);
        break;
      case 8:
        // 1000
        intersects = [this.midPoint[2], this.midPoint[3]];
        this.addIntersection(intersects);
        break;
      case 9:
        // 1001
        intersects = [this.midPoint[0], this.midPoint[2]];
        this.addIntersection(intersects);
        break;
      case 10:
        // 1010
        intersects = [this.midPoint[0], this.midPoint[3]];
        this.addIntersection(intersects);
        intersects = [this.midPoint[1], this.midPoint[2]];
        this.addIntersection(intersects);
        break;
      case 11:
        // 1011
        intersects = [this.midPoint[1], this.midPoint[2]];
        this.addIntersection(intersects);
        break;
      case 12:
        // 1100
        intersects = [this.midPoint[1], this.midPoint[3]];
        this.addIntersection(intersects);
        break;
      case 13:
        // 1101
        intersects = [this.midPoint[0], this.midPoint[1]];
        this.addIntersection(intersects);
        break;
      case 14:
        // 1110
        intersects = [this.midPoint[0], this.midPoint[3]];
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
