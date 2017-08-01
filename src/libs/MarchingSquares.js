import * as THREE from "three";

export default class MarchingSquares {
  constructor(scene, x, y, z, resolution) {
    this.getVertex(x, y, z, resolution);
    this.getMidPoint(x, y, z, resolution);
    this.scene = scene;
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

  //0001
  case01 = () => {
    //    this.addVertexPoint([this.vertex[0]]);
    let intersects = [this.midPoint[0], this.midPoint[3]];
    //   this.addMiddlePoint(intersects);
    this.addIntersection(intersects);
  };

  //0010
  case02 = (vertexs, middle) => {
    //    this.addVertexPoint([vertexs[1]]);
    let intersectPoints = [middle[0], middle[1]];
    //    this.addMiddlePoint(intersectPoints);
    this.addIntersection(intersectPoints);
  };

  // 0011
  case03 = (vertexs, middle) => {
    //    this.addVertexPoint([vertexs[0], vertexs[1]]);
    let intersectPoints = [middle[1], middle[3]];
    //    this.addMiddlePoint(intersectPoints);
    this.addIntersection(intersectPoints);
  };

  // 0100
  case04 = (vertexs, middle) => {
    //    this.addVertexPoint([vertexs[2]]);
    let intersectPoints = [middle[1], middle[2]];
    //    this.addMiddlePoint(intersectPoints);
    this.addIntersection(intersectPoints);
  };
  // 0101
  case05 = (vertexs, middle) => {
    //    this.addVertexPoint([vertexs[0], vertexs[2]]);
    let intersectPoints1 = [middle[0], middle[1]];
    //    this.addMiddlePoint(intersectPoints1);
    this.addIntersection(intersectPoints1);
    let intersectPoints2 = [middle[2], middle[3]];
    //    this.addMiddlePoint(intersectPoints2);
    this.addIntersection(intersectPoints2);
  };
  // 0110
  case06 = (vertexs, middle) => {
    //    this.addVertexPoint([vertexs[1], vertexs[2]]);
    let intersectPoints1 = [middle[0], middle[2]];
    //    this.addMiddlePoint(intersectPoints1);
    this.addIntersection(intersectPoints1);
  };
  // 0111
  case07 = (vertexs, middle) => {
    //    this.addVertexPoint([vertexs[0], vertexs[1], vertexs[2]]);
    let intersectPoints1 = [middle[2], middle[3]];
    //    this.addMiddlePoint(intersectPoints1);
    this.addIntersection(intersectPoints1);
  };
  // 1000
  case08 = (vertexs, middle) => {
    //    this.addVertexPoint([vertexs[3]]);
    let intersectPoints1 = [middle[2], middle[3]];
    //    this.addMiddlePoint(intersectPoints1);
    this.addIntersection(intersectPoints1);
  };
  // 1001
  case09 = (vertexs, middle) => {
    //    this.addVertexPoint([vertexs[0], vertexs[3]]);
    let intersectPoints1 = [middle[0], middle[2]];
    //    this.addMiddlePoint(intersectPoints1);
    this.addIntersection(intersectPoints1);
  };
  // 1010
  case10 = (vertexs, middle) => {
    //    this.addVertexPoint([vertexs[1], vertexs[3]]);
    let intersectPoints1 = [middle[0], middle[3]];
    //    this.addMiddlePoint(intersectPoints1);
    this.addIntersection(intersectPoints1);
    let intersectPoints2 = [middle[1], middle[2]];
    //    this.addMiddlePoint(intersectPoints2);
    this.addIntersection(intersectPoints2);
  };
  // 1011
  case11 = (vertexs, middle) => {
    //    this.addVertexPoint([vertexs[0], vertexs[1], vertexs[3]]);
    let intersectPoints1 = [middle[1], middle[2]];
    //    this.addMiddlePoint(intersectPoints1);
    this.addIntersection(intersectPoints1);
  };
  // 1100
  case12 = (vertexs, middle) => {
    //    this.addVertexPoint([vertexs[2], vertexs[3]]);
    let intersectPoints1 = [middle[1], middle[3]];
    //    this.addMiddlePoint(intersectPoints1);
    this.addIntersection(intersectPoints1);
  };
  // 1101
  case13 = (vertexs, middle) => {
    //    this.addVertexPoint([vertexs[0], vertexs[2], vertexs[3]]);
    let intersectPoints1 = [middle[0], middle[1]];
    //    this.addMiddlePoint(intersectPoints1);
    this.addIntersection(intersectPoints1);
  };
  // 1110
  case14 = (vertexs, middle) => {
    //    this.addVertexPoint([vertexs[1], vertexs[2], vertexs[3]]);
    let intersectPoints1 = [middle[0], middle[3]];
    //    this.addMiddlePoint(intersectPoints1);
    this.addIntersection(intersectPoints1);
  };
  // 1111
  case15 = (vertexs, middle) => {
    //    this.addVertexPoint(vertexs);
  };
}
