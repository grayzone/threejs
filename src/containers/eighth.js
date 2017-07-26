import React from "react";
import * as THREE from "three";
import Stats from "stats.js";
import OrbitControls from "orbit-controls-es6";
import * as dat from "dat.gui/build/dat.gui.js";

var mode = {};
mode.clipIntersection = true;
mode.clipPosition = 0;

export default class Eighth extends React.Component {
  state = {
    aspect: this.props.width / this.props.height,
    clipPlanes: [
      new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
      new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
      new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)
    ]
  };

  componentDidMount = () => {
    this.renderer();
    this.scene();
    this.camera();

    this.loadData();

    this.light();
    this.datGUI();
    this.stats();

    this.control();

    this.animate();
  };

  stats = () => {
    this.stats = new Stats();
    //   this.stats.showPanel(1);
    this.stats.dom.style.position = "absolute";
    this.stats.dom.style.top = "60px";
    this.stats.dom.style.left = "600px";
    this.refs.eighth.appendChild(this.stats.dom);
  };

  datGUI = () => {
    let gui = new dat.GUI();
    //    gui.add(mode, "clipIntersection").onChange(this.switchClipIntersection);
    //    gui.add(mode, "clipPosition", -16, 16);
    gui.domElement.style.position = "absolute";
    gui.domElement.style.top = "0px";
    gui.domElement.style.left = "600px";

    this.refs.eighth.appendChild(gui.domElement);
  };

  scene = () => {
    this.scene = new THREE.Scene();
  };

  control = () => {
    let controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enabled = true;
    controls.target.set(0, 1, 0);
    controls.update();
  };

  renderer = () => {
    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.props.width, this.props.height);

    this.refs.eighth.appendChild(this.renderer.domElement);
  };

  camera = () => {
    this.camera = new THREE.PerspectiveCamera(75, this.state.aspect, 1, 10000);

    this.camera.position.z = 1000;
  };

  light = () => {
    let dirlight = new THREE.DirectionalLight(0xffffff);
    dirlight.position.set(200, 200, 1000).normalize();

    this.camera.add(dirlight);
    this.camera.add(dirlight.target);
  };

  loadData = () => {
    let material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      program: context => {
        context.beginPath();
        context.arc(0, 0, 0.5, 0, Math.PI * 2, true);
        context.fill();
      }
    });
    let geo = new THREE.Geometry();
    for (let i = 0; i < 100; i++) {
      let partice = new THREE.Sprite(material);
      partice.position.x = Math.random() * 2 - 1;
      partice.position.y = Math.random() * 2 - 1;
      partice.position.z = Math.random() * 2 - 1;

      partice.position.normalize();

      partice.position.multiplyScalar(Math.random() * 10 + 450);
      partice.scale.x = 10;
      partice.scale.y = 10;

      //    this.scene.add(partice);

      geo.vertices.push(partice.position);
    }

    let line = new THREE.Line(
      geo,
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        opacity: 0.5
      })
    );
    this.scene.add(line);
  };

  animate = () => {
    this.stats.begin();
    this.renderer.render(this.scene, this.camera);
    this.stats.end();

    requestAnimationFrame(this.animate);
  };

  render = () => {
    return <div ref="eighth" />;
  };
}
