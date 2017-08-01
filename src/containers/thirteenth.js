import React from "react";
import * as THREE from "three";
import Stats from "stats.js";
import OrbitControls from "orbit-controls-es6";
import * as dat from "dat.gui/build/dat.gui.js";

export default class Thirteenth extends React.Component {
  state = {
    aspect: this.props.width / this.props.height,
    sideLength: 64
  };

  componentDidMount = () => {
    this.scene();
    this.renderer();
    this.camera();

    this.objects();

    this.light();
    // this.datGUI();
    this.stats();

    //  this.control();

    this.animate();
  };

  scene = () => {
    this.scene = new THREE.Scene();
  };

  addToContainer = element => {
    this.refs.thirteenth.appendChild(element);
  };

  render = () => {
    return <div ref="thirteenth" />;
  };

  animate = () => {
    this.stats.begin();
    this.update();
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
    requestAnimationFrame(this.animate);
  };

  stats = () => {
    this.stats = new Stats();
    //   this.stats.showPanel(1);
    this.stats.dom.style.position = "absolute";
    this.stats.dom.style.top = "0px";
    this.stats.dom.style.left = "600px";
    this.addToContainer(this.stats.dom);
  };

  control = () => {
    let controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enabled = true;
    controls.target.set(0, 1, 0);
    controls.update();
  };

  //--------------------------------------------------------------------------------------//

  renderer = () => {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0x050505);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.props.width, this.props.height);
    this.addToContainer(this.renderer.domElement);
  };

  datGUI = () => {
    let gui = new dat.GUI();
    gui.domElement.style.position = "absolute";
    gui.domElement.style.top = "50px";
    gui.domElement.style.left = "600px";
    gui.domElement.style.minHeight = "100px";

    this.addToContainer(gui.domElement);
  };

  camera = () => {
    this.camera = new THREE.OrthographicCamera(
      -this.props.width / 2,
      this.props.width / 2,
      this.props.height / 2,
      -this.props.height / 2,
      -500,
      1000
    );
    this.camera.position.set(0, 0, 100);

    //   this.camera.updateMatrixWorld();
  };

  light = () => {
    let ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(ambientLight);
  };

  objects = () => {
    this.addCases();
  };

  drawSquare = (x, y, length, caseIndex) => {
    let vertexs = [
      new THREE.Vector3(x, y, 0),
      new THREE.Vector3(x + length, y, 0),
      new THREE.Vector3(x + length, y + length, 0),
      new THREE.Vector3(x, y + length, 0)
    ];

    let middlePoints = [
      new THREE.Vector3(x + length / 2, y, 0),
      new THREE.Vector3(x + length, y + length / 2, 0),
      new THREE.Vector3(x + length / 2, y + length, 0),
      new THREE.Vector3(x, y + length / 2, 0)
    ];

    let geo = new THREE.Geometry();
    geo.vertices = vertexs;
    let material = new THREE.LineBasicMaterial();
    let square = new THREE.LineLoop(geo, material);
    this.scene.add(square);

    //    console.log("case index:", caseIndex);
    switch (caseIndex) {
      case 0:
        break;
      case 1:
        this.case01(vertexs, middlePoints);
        break;
      case 2:
        this.case02(vertexs, middlePoints);
        break;
      case 3:
        this.case03(vertexs, middlePoints);
        break;
      case 4:
        this.case04(vertexs, middlePoints);
        break;
      case 5:
        this.case05(vertexs, middlePoints);
        break;
      case 6:
        this.case06(vertexs, middlePoints);
        break;
      case 7:
        this.case07(vertexs, middlePoints);
        break;
      case 8:
        this.case08(vertexs, middlePoints);
        break;
      case 9:
        this.case09(vertexs, middlePoints);
        break;
      case 10:
        this.case10(vertexs, middlePoints);
        break;
      case 11:
        this.case11(vertexs, middlePoints);
        break;
      case 12:
        this.case12(vertexs, middlePoints);
        break;
      case 13:
        this.case13(vertexs, middlePoints);
        break;
      case 14:
        this.case14(vertexs, middlePoints);
        break;
      case 15:
        this.case15(vertexs, middlePoints);
        break;
      default:
        break;
    }
  };
  addVertexPoint = vertexs => {
    this.addPoints(vertexs, 3, 0x00ff00);
  };
  addMiddlePoint = vertexs => {
    this.addPoints(vertexs, 2, 0x0000ff);
  };
  addPoints = (vertices, size, color) => {
    let geo = new THREE.Geometry();
    geo.vertices = vertices;
    let material = new THREE.PointsMaterial({
      color: color,
      size: size
    });
    let p = new THREE.Points(geo, material);
    this.scene.add(p);
  };

  addDashLine = vertices => {
    let geo = new THREE.Geometry();
    geo.vertices = vertices;
    let material = new THREE.LineDashedMaterial({
      color: 0xffaa00
    });
    let dashLine = new THREE.Line(geo, material);
    this.scene.add(dashLine);
  };

  //0001
  case01 = (vertexs, middle) => {
    this.addVertexPoint([vertexs[0]]);
    let intersectPoints = [middle[0], middle[3]];
    this.addMiddlePoint(intersectPoints);
    this.addDashLine(intersectPoints);
  };

  //0010
  case02 = (vertexs, middle) => {
    this.addVertexPoint([vertexs[1]]);
    let intersectPoints = [middle[0], middle[1]];
    this.addMiddlePoint(intersectPoints);
    this.addDashLine(intersectPoints);
  };

  // 0011
  case03 = (vertexs, middle) => {
    this.addVertexPoint([vertexs[0], vertexs[1]]);
    let intersectPoints = [middle[1], middle[3]];
    this.addMiddlePoint(intersectPoints);
    this.addDashLine(intersectPoints);
  };

  // 0100
  case04 = (vertexs, middle) => {
    this.addVertexPoint([vertexs[2]]);
    let intersectPoints = [middle[1], middle[2]];
    this.addMiddlePoint(intersectPoints);
    this.addDashLine(intersectPoints);
  };
  // 0101
  case05 = (vertexs, middle) => {
    this.addVertexPoint([vertexs[0], vertexs[2]]);
    let intersectPoints1 = [middle[0], middle[1]];
    this.addMiddlePoint(intersectPoints1);
    this.addDashLine(intersectPoints1);
    let intersectPoints2 = [middle[2], middle[3]];
    this.addMiddlePoint(intersectPoints2);
    this.addDashLine(intersectPoints2);
  };
  // 0110
  case06 = (vertexs, middle) => {
    this.addVertexPoint([vertexs[1], vertexs[2]]);
    let intersectPoints1 = [middle[0], middle[2]];
    this.addMiddlePoint(intersectPoints1);
    this.addDashLine(intersectPoints1);
  };
  // 0111
  case07 = (vertexs, middle) => {
    this.addVertexPoint([vertexs[0], vertexs[1], vertexs[2]]);
    let intersectPoints1 = [middle[2], middle[3]];
    this.addMiddlePoint(intersectPoints1);
    this.addDashLine(intersectPoints1);
  };
  // 1000
  case08 = (vertexs, middle) => {
    this.addVertexPoint([vertexs[3]]);
    let intersectPoints1 = [middle[2], middle[3]];
    this.addMiddlePoint(intersectPoints1);
    this.addDashLine(intersectPoints1);
  };
  // 1001
  case09 = (vertexs, middle) => {
    this.addVertexPoint([vertexs[0], vertexs[3]]);
    let intersectPoints1 = [middle[0], middle[2]];
    this.addMiddlePoint(intersectPoints1);
    this.addDashLine(intersectPoints1);
  };
  // 1010
  case10 = (vertexs, middle) => {
    this.addVertexPoint([vertexs[1], vertexs[3]]);
    let intersectPoints1 = [middle[0], middle[3]];
    this.addMiddlePoint(intersectPoints1);
    this.addDashLine(intersectPoints1);
    let intersectPoints2 = [middle[1], middle[2]];
    this.addMiddlePoint(intersectPoints2);
    this.addDashLine(intersectPoints2);
  };
  // 1011
  case11 = (vertexs, middle) => {
    this.addVertexPoint([vertexs[0], vertexs[1], vertexs[3]]);
    let intersectPoints1 = [middle[1], middle[2]];
    this.addMiddlePoint(intersectPoints1);
    this.addDashLine(intersectPoints1);
  };
  // 1100
  case12 = (vertexs, middle) => {
    this.addVertexPoint([vertexs[2], vertexs[3]]);
    let intersectPoints1 = [middle[1], middle[3]];
    this.addMiddlePoint(intersectPoints1);
    this.addDashLine(intersectPoints1);
  };
  // 1101
  case13 = (vertexs, middle) => {
    this.addVertexPoint([vertexs[0], vertexs[2], vertexs[3]]);
    let intersectPoints1 = [middle[0], middle[1]];
    this.addMiddlePoint(intersectPoints1);
    this.addDashLine(intersectPoints1);
  };
  // 1110
  case14 = (vertexs, middle) => {
    this.addVertexPoint([vertexs[1], vertexs[2], vertexs[3]]);
    let intersectPoints1 = [middle[0], middle[3]];
    this.addMiddlePoint(intersectPoints1);
    this.addDashLine(intersectPoints1);
  };
  // 1111
  case15 = (vertexs, middle) => {
    this.addVertexPoint(vertexs);
  };

  addCases = () => {
    let index = 0;
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 4; i++) {
        let x = -200 + 100 * i;
        let y = 150 - 100 * j;
        this.drawSquare(x, y, this.state.sideLength, index);
        index++;
      }
    }
  };

  update = () => {};
}
