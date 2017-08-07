import React from "react";
import * as THREE from "three";
import Stats from "stats.js";
import OrbitControls from "orbit-controls-es6";
import * as dat from "dat.gui/build/dat.gui.js";
//import MarchingSquares from "../libs/MarchingSquares";

export default class Fifteenth extends React.Component {
  state = {
    aspect: this.props.width / this.props.height,
    params: {
      width: 200,
      height: 160,
      depth: 160
    },
    data: []
  };

  componentDidMount = () => {
    this.scene();
    this.renderer();
    this.camera();

    this.objects();

    this.light();
    this.datGUI();
    this.stats();

    //   this.control();

    this.animate();
  };

  scene = () => {
    this.scene = new THREE.Scene();
  };

  addToContainer = element => {
    this.refs.Fifteenth.appendChild(element);
  };

  render = () => {
    return <div ref="Fifteenth" />;
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

    gui.add(this.state.params, "depth", 1, this.state.params.depth);

    this.addToContainer(gui.domElement);
  };

  camera = () => {
    this.camera = new THREE.OrthographicCamera(
      0,
      this.props.width,
      0,
      -this.props.height,
      // 0,
      -500,
      1000
    );
    this.camera.position.set(0, 0, 100);
  };

  light = () => {
    let ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(ambientLight);
  };

  objects = () => {
    this.addImage();
    this.addVertex();
  };

  addVertex = () => {
    let points = [
      new THREE.Vector3(0, 0, 0),
      //      new THREE.Vector3(0, 512, 0),
      //      new THREE.Vector3(512, 512, 0),
      //      new THREE.Vector3(512, 0, 0),
      new THREE.Vector3(256, -256, 0)
    ];
    let geo = new THREE.Geometry();
    geo.vertices = points;
    let material = new THREE.PointsMaterial({
      size: 3,
      color: 0xffff00
    });
    let p = new THREE.Points(geo, material);
    this.scene.add(p);
  };

  getSliceData = (obj, depth) => {
    let startPos =
      (Math.round(depth) - 1) *
      this.state.params.width *
      this.state.params.height;
    return obj.slice(
      startPos,
      startPos + this.state.params.width * this.state.params.height
    );
  };

  loadSlice = () => {
    return this.getSliceData(this.state.data, this.state.params.depth);
  };

  showSlice = () => {
    if (this.state.data.length === 0) {
      return;
    }

    if (this.sliceObj !== undefined) {
      this.scene.remove(this.sliceObj);
    }

    let textTure = new THREE.DataTexture(
      this.loadSlice(),
      this.state.params.width,
      this.state.params.height
    );

    textTure.format = THREE.LuminanceFormat;
    textTure.type = THREE.UnsignedByteType;

    let geo = new THREE.PlaneGeometry(this.props.width, this.props.height);

    //    geo.addAtribute("position", new THREE.Uint8Attribute(s, 1));

    let spriteMaterial = new THREE.MeshBasicMaterial({
      map: textTure
      //     color: 0xffffff,
      //     transparent: true
    });
    textTure.needsUpdate = true;
    this.sliceObj = new THREE.Mesh(geo, spriteMaterial);
    this.sliceObj.position.x = 256;
    this.sliceObj.position.y = -256;

    this.scene.add(this.sliceObj);
  };

  handleRawOnload = data => {
    let array = new Uint8Array(data);
    this.setState({
      data: array
    });

    this.showSlice();
  };

  handleRawOnProgress = xhr => {
    console.log(xhr.loaded / xhr.total * 100 + "% loaded");
  };

  hanldeRawOnError = xhr => {
    console.log("Raw load failed, ", xhr);
  };

  addImage = () => {
    let loader = new THREE.FileLoader();
    loader.setResponseType("arraybuffer");
    loader.load(
      "data/mri.raw",
      this.handleRawOnload,
      this.handleRawOnProgress,
      this.hanldeRawOnError
    );
  };

  update = () => {
    this.showSlice();
  };
}
