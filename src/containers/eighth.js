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

    this.loadLiver();
    this.addLight();
    this.datGUI();
    this.stats();

    this.addControl();

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

  switchClipIntersection = () => {
    let children = this.group.children;
    for (let i = 0; i < children.length; i++) {
      var child = children[i];
      child.material.clipIntersection = !child.material.clipIntersection;
    }
  };

  datGUI = () => {
    let gui = new dat.GUI();
    gui.add(mode, "clipIntersection").onChange(this.switchClipIntersection);
    gui.add(mode, "clipPosition", -16, 16);
    gui.domElement.style.position = "absolute";
    gui.domElement.style.top = "0px";
    gui.domElement.style.left = "600px";

    this.refs.eighth.appendChild(gui.domElement);
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

    this.renderer.antialias = false;
    this.renderer.alpha = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.props.width, this.props.height);

    this.refs.eighth.appendChild(this.renderer.domElement);
  };

  camera = () => {
    this.camera = new THREE.PerspectiveCamera(
      55,
      this.state.aspect,
      2,
      2000
    );

    this.camera.position.z = 1000;
  };

  addLight = () => {
    let dirlight = new THREE.DirectionalLight(0xffffff);
    dirlight.position.set(200, 200, 1000).normalize();

    this.camera.add(dirlight);
    this.camera.add(dirlight.target);
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

  loadLiverVTKImage = geo => {
    geo.computeVertexNormals();
    let vtkmaterial = new THREE.MeshLambertMaterial({
      wireframe: false,
      morphTargets: false,
      side: THREE.DoubleSide,
      color: 0xff0000
    });
    let mesh = new THREE.Mesh(geo, vtkmaterial);
    this.scene.add(mesh);
  };

  loadLiver = () => {
    let vtkLoader = new THREE.VTKLoader();
    vtkLoader.load("../../data/liver.vtk", function(geometry) {
      this.loadLiverVTKImage(geometry);
    });
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
    return <div ref="eighth" />;
  };
}
