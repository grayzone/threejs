import React from "react";
import * as THREE from "three";

export default class First extends React.Component {
  componentDidMount() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.props.width / this.props.height,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.props.width, this.props.height);
    this.refs.first.appendChild(this.renderer.domElement);

    this.addCube();
    this.addLight();

    this.animate();
  }

  addCube = () => {
    var geo = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geo, material);
    this.scene.add(this.cube);
    this.camera.position.z = 5;
  };

  addLight = () => {
    let light = new THREE.PointLight(0xffff00);
    light.position.set(1, 0, 2);
    this.scene.add(light);
  };

  animate = () => {
    requestAnimationFrame(this.animate);

    this.cube.rotation.x += 0.1;
    this.cube.rotation.y += 0.1;

    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return <div ref="first" />;
  }
}
