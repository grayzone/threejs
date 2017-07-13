import React from "react";
import * as THREE from "three";

export default class Second extends React.Component {
  initRender = () => {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(new THREE.Vector3(0, 0, 100));

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.props.width, this.props.height);
    this.refs.second.appendChild(this.renderer.domElement);
  };
  componentDidMount() {
    this.initRender();
    this.addLine();
    this.animate();
  }

  addLine = () => {
    let geo = new THREE.BoxGeometry();
    geo.vertices.push(new THREE.Vector3(-10, 0, 0));
    geo.vertices.push(new THREE.Vector3(0, 10, 0));
    geo.vertices.push(new THREE.Vector3(10, 0, 0));

    let material = new THREE.LineBasicMaterial({ color: 0x0000ff });

    let line = new THREE.Line(geo, material);
    this.scene.add(line);
  };

  animate = () => {
    requestAnimationFrame(this.animate);

    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return <div ref="second" />;
  }
}
