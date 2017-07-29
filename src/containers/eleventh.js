import React from "react";
import * as THREE from "three";
import Stats from "stats.js";
import OrbitControls from "orbit-controls-es6";
import * as dat from "dat.gui/build/dat.gui.js";
//import MarchingCubes from "../libs/MarchingCubes";

export default class Eleventh extends React.Component {
  state = {
    aspect: this.props.width / this.props.height,
    params: {
      resolution: 28
    }
  };

  componentDidMount = () => {
    this.scene();
    this.renderer();
    this.camera();

    this.objects();

    this.light();
    this.datGUI();
    this.stats();

    this.control();

    this.animate();
  };

  scene = () => {
    this.scene = new THREE.Scene();
  };

  addToContainer = element => {
    this.refs.eleventh.appendChild(element);
  };

  animate = () => {
    this.stats.begin();
    this.update();
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
    requestAnimationFrame(this.animate);
  };

  render = () => {
    return <div ref="eleventh" />;
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
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;

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
    this.camera = new THREE.PerspectiveCamera(100, this.state.aspect, 1, 10000);
    this.camera.position.set(0, 100, 0);
  };

  light = () => {
    let light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0.5, 0.5, 1);
    this.scene.add(light);

    let pointLight = new THREE.PointLight(0xff3300);
    pointLight.position.set(0, 0, 100);
    this.scene.add(pointLight);

    let ambientLight = new THREE.AmbientLight(0x080808);
    this.scene.add(ambientLight);
  };

  objects = () => {
    this.addPlane();
    this.addHelper();
    this.addAxis();
    this.addEdges();
  };

  addPlane = () => {
    let geo = new THREE.PlaneGeometry(2000, 2000);
    geo.rotateX(-Math.PI / 2);
    let m = new THREE.ShadowMaterial({
      opacity: 0.2
    });
    this.plane = new THREE.Mesh(geo, m);
    this.plane.position.y = 0;
    this.plane.receiveShadow = true;
    this.scene.add(this.plane);
  };

  addHelper = () => {
    this.helper = new THREE.GridHelper(2000, 1000);
    this.helper.position.y = 0;
    this.helper.material.opacity = 0.25;
    this.helper.material.transparent = true;
    this.scene.add(this.helper);
  };

  addAxis = () => {
    this.axis = new THREE.AxisHelper();
    this.axis.position.set(0, 0, 0);
    this.scene.add(this.axis);
  };

  addEdges = () => {
    let geo = new THREE.Geometry();
    geo.vertices.push(
      new THREE.Vector3(-1, -1, -1),
      new THREE.Vector3(-1, -1, 1),
      new THREE.Vector3(-1, 1, -1),
      new THREE.Vector3(1, -1, -1),
      new THREE.Vector3(1, 1, -1),
      new THREE.Vector3(1, -1, 1),
      new THREE.Vector3(-1, 1, 1),
      new THREE.Vector3(1, 1, 1)
    );

    //   geo.computeVertexNormals();

    let materialpoints = new THREE.PointsMaterial({
      //     color: 0x0000ff,
      //  size: 5
      opacity: 0.5
    });
    let edges = new THREE.Points(geo, materialpoints);
    this.scene.add(edges);

    let materialLines = new THREE.LineBasicMaterial();
    let vertexs = new THREE.Line(geo, materialLines);
    this.scene.add(vertexs);
  };

  update = () => {};
}
