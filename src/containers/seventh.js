import React from "react";
import * as THREE from "three";
import Stats from "stats.js";
import OrbitControls from "orbit-controls-es6";
import * as dat from "dat.gui/build/dat.gui.js";

var mode = {};
mode.clipIntersection = true;
mode.clipPosition = 0;

export default class Seventh extends React.Component {
  state = {
    aspect: this.props.width / this.props.height,
    clipPlanes: [
      new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
      new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
      new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)
    ]
  };

  componentDidMount = () => {
    this.camera();
    this.scene();
    this.addLight();
    this.addGroup();
    this.renderer();
    this.stats();
    this.gui();
    this.addControl();

    this.animate();
  };

  stats = () => {
    this.stats = new Stats();
    this.stats.showPanel(1);
    this.stats.dom.style.position = "relative";
    this.refs.seventh.appendChild(this.stats.dom);
  };

  switchClipIntersection = () => {
    let children = this.group.children;
    for (let i = 0; i < children.length; i++) {
      var child = children[i];
      child.material.clipIntersection = !child.material.clipIntersection;
    }
  };

  gui = () => {
    const gui = new dat.GUI();
    gui.add(mode, "clipIntersection").onChange(this.switchClipIntersection);
    gui.add(mode, "clipPosition", -16, 16);
  };

  scene = () => {
    this.scene = new THREE.Scene();
  };

  addControl = () => {
    let controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enabled = true;
    controls.target.set(0, 1, 0);
    controls.update();
  };

  renderer = () => {
    this.renderer = new THREE.WebGLRenderer();

    this.renderer.antialias = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.props.width, this.props.height);
    this.renderer.setClearColor(0x222222);

    this.renderer.localClippingEnabled = true;

    this.refs.seventh.appendChild(this.renderer.domElement);
  };

  camera = () => {
    this.camera = new THREE.PerspectiveCamera(40, this.state.aspect, 1, 800);
    this.camera.position.set(-20, 10, 50);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  };

  addLight = () => {
    let light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    this.scene.add(light);

    let ambientLight = new THREE.AmbientLight(0x505050);
    this.scene.add(ambientLight);
  };

  addGroup = () => {
    this.group = new THREE.Object3D();
    for (let i = 1; i < 25; i++) {
      let geo = new THREE.SphereBufferGeometry(i / 2, 48, 48);
      let material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(
          Math.sin(i * 0.5) * 0.5 + 0.5,
          Math.cos(i * 1.5) * 0.5 + 0.5,
          Math.sin(i * 4.5) * 0.5 + 0.5
        ),
        roughness: 0.95,
        metalness: 0.0,
        side: THREE.DoubleSide,
        clippingPlanes: this.state.clipPlanes,
        clipIntersection: true
      });
      this.group.add(new THREE.Mesh(geo, material));
    }
    this.scene.add(this.group);
  };

  animate = () => {
    this.stats.begin();
    this.threeRender();
    this.renderer.render(this.scene, this.camera);
    this.stats.end();

    requestAnimationFrame(this.animate);
  };

  threeRender = () => {
    let children = this.group.children;

    for (let i = 0; i < children.length; i++) {
      let current = children[i].material;

      for (let j = 0; j < current.clippingPlanes.length; j++) {
        let plane = current.clippingPlanes[j];
        plane.constant = (49 * plane.constant + mode.clipPosition) / 50;
      }
    }
  };

  render = () => {
    return <div ref="seventh" />;
  };
}
