import React from "react";
import * as THREE from "three";
import Stats from "stats.js";

export default class Fifth extends React.Component {
  state = {
    amount: 6,
    aspect: this.props.width / this.props.height
  };
  componentDidMount = () => {
    this.addStat();
    this.addScene();
    this.addCameras();    
    this.addLight();
    this.addBackground();
    this.addMesh();
    this.addRender();
    this.animate();
  };

  addStat = () => {
    this.stats = new Stats();
    this.stats.dom.style.position = "relative";
    this.refs.sixth.appendChild(this.stats.dom);
  };

  addScene = () => {
    this.scene = new THREE.Scene();
  };

  addCameras = () => {
    var cameras = [];
    let amount = this.state.amount;
    let size = 1 / amount;

    for (let y = 0; y < amount; y++) {
      for (let x = 0; x < amount; x++) {
        var subcamera = new THREE.PerspectiveCamera(
          40,
          this.state.aspect,
          0.1,
          10
        );
        subcamera.bounds = new THREE.Vector4(
          x / amount,
          y / amount,
          size,
          size
        );
        subcamera.position.x = x / amount - 0.5;
        subcamera.position.y = 0.5 - y / amount;
        subcamera.position.z = 1.5;
        subcamera.position.multiplyScalar(2);
        subcamera.lookAt(new THREE.Vector3());
        subcamera.updateMatrixWorld();
        cameras.push(subcamera);
      }
    }

    this.camera = new THREE.ArrayCamera(cameras);
    this.camera.position.z = 3;
  };

  addMesh = () => {
    let geo = new THREE.CylinderBufferGeometry(0.5, 0.5, 1, 32);
    let material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    this.mesh = new THREE.Mesh(geo, material);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.scene.add(this.mesh);
  };

  addLight = () => {
    let ambientLight = new THREE.AmbientLight(0x222244);
    this.scene.add(ambientLight);

    let light = new THREE.DirectionalLight();
    light.position.set(0.5, 0.5, 1);
    light.castShadow = true;
    light.shadow.camera.zoom = 4;

    this.scene.add(light);
  };

  addBackground = () => {
    var geo = new THREE.PlaneBufferGeometry(100, 100);
    var material = new THREE.MeshPhongMaterial({ color: 0x000066 });
    let background = new THREE.Mesh(geo, material);
    background.receiveShadow = true;
    background.position.set(0, 0, -1);
    this.scene.add(background);
  };

  addRender = () => {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.props.width, this.props.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.shadowMap.enabled = true;

    this.refs.sixth.appendChild(this.renderer.domElement);
  };

  animate = () => {
    requestAnimationFrame(this.animate);

    this.threeRender();
    this.stats.update();

    this.renderer.render(this.scene, this.camera);
  };

  threeRender = () => {
    this.mesh.rotation.x += 0.005;
    this.mesh.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return <div ref="sixth" />;
  }
}
