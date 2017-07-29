import React from "react";
import * as THREE from "three";
import Stats from "stats.js";
import OrbitControls from "orbit-controls-es6";
import * as dat from "dat.gui/build/dat.gui.js";

export default class Ninth extends React.Component {
  state = {
    aspect: this.props.width / this.props.height,
    segments: 200,
    splinePointLength: 4,
    positions: [],
    params: {
      helper: true,
      plane: true,
      axis: true
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
    this.refs.ninth.appendChild(element);
  };

  animate = () => {
    this.stats.begin();
    this.update();
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
    requestAnimationFrame(this.animate);
  };

  render = () => {
    return <div ref="ninth" />;
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
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0xf0f0f0);
    this.renderer.shadowMap.enabled = true;

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.props.width, this.props.height);
    this.addToContainer(this.renderer.domElement);
  };

  datGUI = () => {
    let gui = new dat.GUI();
    gui.domElement.style.position = "absolute";
    //   gui.domElement.style.position = "relative";
    gui.domElement.style.top = "50px";
    gui.domElement.style.left = "600px";
    gui.domElement.style.minHeight = "100px";

    gui.add(this.state.params, "helper");
    gui.add(this.state.params, "plane");
    gui.add(this.state.params, "axis");

    this.addToContainer(gui.domElement);
  };

  camera = () => {
    this.camera = new THREE.PerspectiveCamera(70, this.state.aspect, 1, 10000);
    this.camera.position.set(0, 250, 1000);
  };

  light = () => {
    let ambientLight = new THREE.AmbientLight(0xf0f0f0);
    this.scene.add(ambientLight);

    let spotLight = new THREE.SpotLight(0xffffff, 1.5);
    spotLight.position.set(0, 1500, 200);
    spotLight.castShadow = true;
    spotLight.shadow = new THREE.LightShadow(
      new THREE.PerspectiveCamera(70, 1, 200, 2000)
    );
    spotLight.shadow.bias = -0.000222;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    this.scene.add(spotLight);
  };

  objects = () => {
    this.addPlane();
    this.addHelper();
    this.addAxis();
    this.splines();
  };

  addPlane = () => {
    let geo = new THREE.PlaneGeometry(2000, 2000);
    geo.rotateX(-Math.PI / 2);
    let m = new THREE.ShadowMaterial({
      opacity: 0.2
    });
    this.plane = new THREE.Mesh(geo, m);
    this.plane.position.y = -200;
    this.plane.receiveShadow = true;
    this.scene.add(this.plane);
  };

  addHelper = () => {
    this.helper = new THREE.GridHelper(2000, 100);
    this.helper.position.y = -199;
    this.helper.material.opacity = 0.25;
    this.helper.material.transparent = true;
    this.scene.add(this.helper);
  };

  addAxis = () => {
    this.axis = new THREE.AxisHelper();
    this.axis.position.set(-500, -500, -500);
    this.scene.add(this.axis);
  };

  splines = () => {
    for (let i = 0; i < this.state.splinePointLength; i++) {
      this.addSplineObject();
    }
    this.spline = [];

    this.addCurve("catmullrom", 0xff0000);
    this.addCurve("centripetal", 0x00ff00);
    this.addCurve("chordal", 0x0000ff);

    for (let k in this.spline) {
      let s = this.spline[k];
      //      console.log("item:", s.mesh);
      this.scene.add(s.mesh);
    }

    console.log(this.spline);
  };

  addSplineObject = () => {
    let m = new THREE.MeshLambertMaterial({
      color: Math.random() * 0xffffff
    });
    let obj = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), m);
    obj.position.x = Math.random() * 1000 - 500;
    obj.position.y = Math.random() * 600;
    obj.position.z = Math.random() * 800 - 400;
    obj.castShadow = true;
    obj.receiveShadow = true;

    let newPos = this.state.positions;
    newPos.push(obj.position);
    this.setState({
      positions: newPos
    });
    this.scene.add(obj);
  };

  addCurve = (type, color) => {
    let curve = new THREE.CatmullRomCurve3(this.state.positions);
    curve.type = type;
    var geometry = new THREE.Geometry();

    geometry.vertices = curve.getPoints(this.state.segments);

    curve.mesh = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({
        color: color,
        opacity: 0.35,
        linewidth: 2
      })
    );
    curve.mesh.castShadow = true;
    this.spline.push(curve);
  };

  update = () => {
    this.plane.visible = this.state.params.plane;
    this.helper.visible = this.state.params.helper;
    this.axis.visible = this.state.params.axis;
  };
}
