import React from "react";
import * as THREE from "three";
import Stats from "stats.js";
import OrbitControls from "orbit-controls-es6";
import * as dat from "dat.gui/build/dat.gui.js";
import MarchingSquares from "../libs/MarchingSquares";

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
    let geo = new THREE.Geometry();
    geo.vertices = vertexs;
    let material = new THREE.LineBasicMaterial();
    let square = new THREE.LineLoop(geo, material);
    this.scene.add(square);
  };

  addCases = () => {
    let data = [
      [0, 0, 0, 0],
      [1.8, 0.6, 0.8, 0.4],
      [0, 1.2, 0.4, 0.1],
      [1.1, 1.8, 0.6, 0.8],
      [0.3, 0.1, 1.7, 0.8],
      [1.5, 0.6, 1.8, 0.1],
      [0, 1.5, 1.8, 0],
      [1.1, 1.4, 1.5, 0],
      [0, 0, 0, 1.5],
      [1.2, 0, 0, 1.9],
      [0, 1.3, 0, 1.9],
      [1.3, 1.1, 0, 1.8],
      [0, 0, 1.2, 1.8],
      [1.2, 0, 1.9, 1.6],
      [0, 1.4, 1.1, 1.8],
      [1, 1, 1, 1]
    ];
    let index = 0;
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 4; i++) {
        let x = -200 + 100 * i;
        let y = 150 - 100 * j;
        this.drawSquare(x, y, this.state.sideLength, index);

        let m = new MarchingSquares(
          this.scene,
          { x: x, y: y, z: 0 },
          64,
          1,
          data[index]
        );
        m.render();
        index++;
      }
    }
  };

  update = () => {};
}
