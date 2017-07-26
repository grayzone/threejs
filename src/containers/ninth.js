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
    positions: []
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
    this.stats.dom.style.top = "60px";
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
    gui.domElement.style.top = "0px";
    gui.domElement.style.left = "600px";

    this.addToContainer(gui.domElement);
  };

  camera = () => {
    this.camera = new THREE.PerspectiveCamera(70, this.state.aspect, 1, 10000);
    this.camera.position.set(0, 250, 1000);
    //  this.scene.add(this.camera);
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
    this.plane();
    this.helper();
    this.axis();
    this.splines();
  };

  plane = () => {
    let geo = new THREE.PlaneGeometry(2000, 2000);
    geo.rotateX(-Math.PI / 2);
    let m = new THREE.ShadowMaterial({
      opacity: 0.2
    });
    let p = new THREE.Mesh(geo, m);
    p.position.y = -200;
    p.receiveShadow = true;
    this.scene.add(p);
  };

  helper = () => {
    let h = new THREE.GridHelper(2000, 100);
    h.position.y = -199;
    h.material.opacity = 0.25;
    h.material.transparent = true;
    this.scene.add(h);
  };

  axis = () => {
    let a = new THREE.AxisHelper();
    a.position.set(-500, -500, -500);
    this.scene.add(a);
  };

  splines = () => {
    this.positions = [];
    for (let i = 0; i < this.state.splinePointLength; i++) {
      this.addSplineObject();
    }
 //   this.intialData();
    console.log("positions:", this.positions);
    this.spline = [];

    this.addCurve("catmullrom", 0xff0000);
    this.addCurve("centripetal", 0x00ff00);
    this.addCurve("chordal", 0x0000ff);

    for (let k in this.spline) {
      let s = this.spline[k];
      console.log("item:", s.mesh);
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

    this.positions.push(obj.position);
    this.scene.add(obj);
  };

  addCurve = (type, color) => {
    let curve = new THREE.CatmullRomCurve3(this.positions);
    curve.type = type;
    var geometry = new THREE.Geometry();
    
    geometry.vertices = curve.getPoints(200);

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
}
