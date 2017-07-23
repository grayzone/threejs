import React from "react";
import * as THREE from "three";

export default class Fourth extends React.Component {
  componentDidMount = () => {
    this.addScene();
    this.addRender();
    this.addCamera();
    this.addLine();
    //  this.addLight();

    this.animate();
  };

  addRender = () => {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.props.width, this.props.height);
    this.refs.fourth.appendChild(this.renderer.domElement);
  };

  addScene = () => {
    this.scene = new THREE.Scene();
  };

  addCamera = () => {
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.props.width / this.props.height,
      1,
      500
    );
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  };

  addLine = () => {
    var geo = new THREE.BoxGeometry();
    geo.vertices.push(new THREE.Vector3(-10, 0, 0));
    geo.vertices.push(new THREE.Vector3(0, 10, 0));
    geo.vertices.push(new THREE.Vector3(10, 0, 0));

    var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    this.line = new THREE.Line(geo, material);
    this.scene.add(this.line);
  };

  addLight = () => {
    let light = new THREE.PointLight(0xffff00);
    light.position.set(1, 0, 2);
    this.scene.add(light);
  };

  animate = () => {
    requestAnimationFrame(this.animate);

    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return <div ref="fourth" />;
  }
}
