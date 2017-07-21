import React from "react";
import * as THREE from "three";
import threeOrbitControls from "three-orbit-controls";

var OrbitControls = threeOrbitControls(THREE);

export default class Third extends React.Component {
  initRender = () => {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 30, 50);
    this.camera.lookAt(new THREE.Vector3(0, 15, 0));

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.props.width, this.props.height);
    this.renderer.setClearColor(0xfff6e6);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.refs.third.appendChild(this.renderer.domElement);
  };
  componentDidMount() {
    this.initRender();
    this.addGeometry1();
    this.addGeometry2();
    this.addLight();
    this.addShadow();
    this.addControl();
    this.animate();
  }

  addGeometry1 = () => {
    let geo = new THREE.OctahedronGeometry(10, 1);

    let material = new THREE.MeshStandardMaterial({
      color: 0xff0051,
      shading: THREE.FlatShading,
      metalness: 0,
      roughness: 1
    });

    let g = new THREE.Mesh(geo, material);
    g.position.y += 10;
    g.rotateZ(Math.PI / 3);
    g.castShadow = true;
    this.scene.add(g);
  };

  addGeometry2 = () => {
    let geo = new THREE.OctahedronGeometry(5, 1);

    let material = new THREE.MeshStandardMaterial({
      color: 0x47689b,
      shading: THREE.FlatShading,
      metalness: 0,
      roughness: 0.8
    });

    let g = new THREE.Mesh(geo, material);
    g.position.y += 5;
    g.position.x += 15;
    g.rotateZ(Math.PI / 5);
    g.castShadow = true;
    this.scene.add(g);
  };

  addShadow = () => {
    let shadow = new THREE.BoxGeometry(100, 0.1, 100);

    let shadowMaterial = new THREE.ShadowMaterial({ color: 0xeeeeee });
    shadowMaterial.opacity = 0.5;

    let g = new THREE.Mesh(shadow, shadowMaterial);
    g.receiveShadow = true;

    this.scene.add(g);
  };

  addLight = () => {
    let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientLight);

    let pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(25, 50, 25);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    this.scene.add(pointLight);
  };

  addControl = () => {
    let c = new OrbitControls(this.camera, this.renderer.domElement);
    c.target = new THREE.Vector3(0, 15, 0);
    c.maxPolarAngle = Math.PI / 2;
    c.addEventListener("change", this.animate);
  };

  animate = () => {
//    requestAnimationFrame(this.animate);

    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return <div ref="third" />;
  }
}
