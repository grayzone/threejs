import React from "react";
import * as THREE from "three";
import Stats from "stats.js";
import OrbitControls from "orbit-controls-es6";
import * as dat from "dat.gui/build/dat.gui.js";

export default class Thirteenth extends React.Component {
  state = {
    aspect: this.props.width / this.props.height
  };

  componentDidMount = () => {
    this.scene();
    this.renderer();
    this.camera();

    this.objects();

    this.light();
    // this.datGUI();
    this.stats();

    this.control();

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
    //    this.camera.position.y = 10;
    this.camera.position.set(0, 0, 100);
    //   this.camera.rotation.x = Math.PI / 2;
    //  this.camera.rotation.y = 0;
    //   this.camera.rotation.z = Math.PI / 2;

    this.camera.updateMatrixWorld();
  };

  light = () => {
    let ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(ambientLight);
  };

  objects = () => {
    //   this.addGridHelper();
    this.addAxis();
    //   this.addCube();
    this.addPoints();
  };

  addGridHelper = () => {
    this.helper = new THREE.GridHelper(512, 8);
    this.scene.add(this.helper);
  };
  addAxis = () => {
    this.axis = new THREE.AxisHelper();
    this.axis.position.set(0, 0, 0);
    this.scene.add(this.axis);
  };

  addCube = () => {
    let geo = new THREE.BoxGeometry(50, 50, 50);
    let material = new THREE.MeshLambertMaterial({
      overdraw: 0.5,
      color: 0xffffff
    });
    //    let cube = new THREE.Mesh(geo, material);
    /*
    for (var i = 0; i < 100; i++) {
      var cube = new THREE.Mesh(geo, material);
      //    cube.scale.y = Math.floor(Math.random() * 2 + 1);
      cube.position.x = Math.floor((Math.random() * 1000 - 500) / 50) * 50 + 25;
      cube.position.y = cube.scale.y * 50 / 2;
      cube.position.z = Math.floor((Math.random() * 1000 - 500) / 50) * 50 + 25;
      this.scene.add(cube);
      
    }
    */

    var cube = new THREE.Mesh(geo, material);
    cube.position.x = 0;
    cube.position.y = 0;
    cube.position.z = 0;
    this.scene.add(cube);
  };

  drawSquare = (x, y, length, cases) => {
    let edge = [
      new THREE.Vector3(x, y, 0),
      new THREE.Vector3(x + length, y, 0),
      new THREE.Vector3(x + length, y + length, 0),
      new THREE.Vector3(x, y + length, 0)
    ];
    let geo = new THREE.Geometry();
    geo.vertices = edge;
    let material = new THREE.LineBasicMaterial();
    let square = new THREE.LineLoop(geo, material);
    this.scene.add(square);

    for (let i = 0; i < cases.length; i++) {
      if (cases[i] === 0) {
        continue;
      }
      let geoEdge = new THREE.Geometry();
      geoEdge.vertices = [edge[i]];
      let materialEdge = new THREE.PointsMaterial({
        size: 3
      });
      let edges = new THREE.Points(geoEdge, materialEdge);
      this.scene.add(edges);
    }
  };

  addPoints = () => {
    this.drawSquare(-200, 160, 64, [0, 1, 1, 1]);
    this.drawSquare(-100, 160, 64, [1, 0, 1, 1]);
    this.drawSquare(0, 160, 64, [1, 1, 0, 1]);
    this.drawSquare(100, 160, 64, [1, 1, 1, 0]);

    this.drawSquare(-200, 60, 64, [0, 0, 1, 1]);
    this.drawSquare(-100, 60, 64, [0, 1, 0, 1]);
    this.drawSquare(0, 60, 64, [0, 1, 1, 0]);
    this.drawSquare(100, 60, 64, [1, 0, 0, 1]);

    this.drawSquare(-200, -40, 64, [1, 0, 1, 0]);
    this.drawSquare(-100, -40, 64, [1, 1, 0, 0]);
    this.drawSquare(0, -40, 64, [1, 0, 0, 0]);
    this.drawSquare(100, -40, 64, [0, 1, 0, 0]);

    this.drawSquare(-200, -140, 64, [0, 0, 1, 0]);
    this.drawSquare(-100, -140, 64, [0, 0, 0, 1]);
    this.drawSquare(0, -140, 64, [0, 0, 0, 0]);
    this.drawSquare(100, -140, 64, [1, 1, 1, 1]);
  };

  update = () => {};
}
