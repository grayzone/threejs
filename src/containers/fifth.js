import React from "react";
import * as THREE from "three";
import Stats from "stats.js";

export default class Fifth extends React.Component {
  state = {
    aspect: this.props.width / this.props.height,
    frustumSize: 600
  };
  componentDidMount = () => {
    this.addScene();
    this.addRender();
    this.addCamera();
    this.addCameraPerspective();
    this.addCameraOrtho();
    this.addCameraRig();
    this.addMesh();
    this.addGeometry();
    this.addListener();
    this.addStat();

    //  this.addLight();

    this.animate();
  };

  addStat = () => {
    this.stats = new Stats();
    this.stats.dom.style.position = "relative";
    this.stats.dom.style.right = "0px";
    this.stats.dom.style.top = "0px";

    this.refs.fifth.appendChild(this.stats.dom);
  };

  addScene = () => {
    this.scene = new THREE.Scene();
  };

  addRender = () => {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.props.width, this.props.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.domElement.style.position = "relative";
    this.refs.fifth.appendChild(this.renderer.domElement);
    this.renderer.autoClear = false;
  };

  addListener = () => {
    window.addEventListener("resize", this.onWindowResize, false);
    document.addEventListener("keydown", this.onKeyDown, false);
  };

  onWindowResize = event => {};

  onKeyDown = event => {
    switch (event.keyCode) {
      case 79:
        this.activeCamera = this.cameraOrtho;
        this.activeHelper = this.cameraOrthoHelper;
        break;
      case 80:
        this.activeCamera = this.cameraPerspective;
        this.activeHelper = this.cameraPerspectiveHelper;
        break;
      default:
        break;
    }
  };

  addCamera = () => {
    console.log("aspect:", this.state.aspect);
    this.camera = new THREE.PerspectiveCamera(
      50,
      0.5 * this.state.aspect,
      1,
      10000
    );
    this.camera.position.z = 2500;
  };

  addCameraPerspective = () => {
    this.cameraPerspective = new THREE.PerspectiveCamera(
      50,
      0.5 * this.state.aspect,
      150,
      1000
    );

    this.cameraPerspective.rotation.y = Math.PI;

    this.cameraPerspectiveHelper = new THREE.CameraHelper(
      this.cameraPerspective
    );
    this.scene.add(this.cameraPerspectiveHelper);

    this.activeCamera = this.cameraPerspective;
    this.activeHelper = this.cameraPerspectiveHelper;
  };

  addCameraOrtho = () => {
    let frustumSize = this.state.frustumSize;
    let aspect = this.state.aspect;
    this.cameraOrtho = new THREE.OrthographicCamera(
      -0.25 * frustumSize * aspect,
      0.25 * frustumSize * aspect,
      0.5 * frustumSize,
      -0.5 * frustumSize,
      150,
      1000
    );
    this.cameraOrtho.rotation.y = Math.PI;

    this.cameraOrthoHelper = new THREE.CameraHelper(this.cameraOrtho);
    this.scene.add(this.cameraOrthoHelper);
  };

  addCameraRig = () => {
    this.cameraRig = new THREE.Group();
    this.cameraRig.add(this.cameraPerspective);
    this.cameraRig.add(this.cameraOrtho);

    this.scene.add(this.cameraRig);
  };

  addMesh = () => {
    this.mesh = new THREE.Mesh(
      new THREE.SphereBufferGeometry(100, 16, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
    );
    this.scene.add(this.mesh);

    let mesh2 = new THREE.Mesh(
      new THREE.SphereBufferGeometry(50, 16, 8),
      new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    );
    mesh2.position.y = 150;
    this.mesh.add(mesh2);

    let mesh3 = new THREE.Mesh(
      new THREE.SphereBufferGeometry(5, 16, 8),
      new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
    );

    mesh3.position.z = 150;
    this.cameraRig.add(mesh3);
  };

  addGeometry = () => {
    let geo = new THREE.Geometry();
    for (let i = 0; i < 10000; i++) {
      let vertex = new THREE.Vector3();
      vertex.x = THREE.Math.randFloatSpread(2000);
      vertex.y = THREE.Math.randFloatSpread(2000);
      vertex.z = THREE.Math.randFloatSpread(2000);

      geo.vertices.push(vertex);
    }
    let material = new THREE.PointsMaterial({ color: 0x888888 });
    let particles = new THREE.Points(geo, material);
    this.scene.add(particles);
  };

  addLight = () => {
    let light = new THREE.PointLight(0xffff00);
    light.position.set(1, 0, 2);
    this.scene.add(light);
  };

  animate = () => {
    requestAnimationFrame(this.animate);

    this.threeRender();
    this.stats.update();

    this.renderer.render(this.scene, this.camera);
  };

  threeRender = () => {
    let r = Date.now() * 0.0005;

    this.mesh.position.x = 700 * Math.cos(r);
    this.mesh.position.y = 700 * Math.sin(r);
    this.mesh.position.z = 700 * Math.sin(r);

    this.mesh.children[0].position.x = 70 * Math.cos(2 * r);
    this.mesh.children[0].position.z = 70 * Math.sin(r);

    if (this.activeCamera === this.cameraPerspective) {
      this.cameraPerspective.fov = 35 + 30 * Math.sin(0.5 * r);
      this.cameraPerspective.far = this.mesh.position.length();
      this.cameraPerspective.updateProjectionMatrix();

      this.cameraPerspectiveHelper.update();
      this.cameraPerspectiveHelper.visible = true;

      this.cameraOrthoHelper.visible = false;
    } else {
      this.cameraOrtho.fov = this.mesh.position.length();
      this.cameraOrtho.updateProjectionMatrix();

      this.cameraOrthoHelper.update();
      this.cameraOrthoHelper.visible = true;

      this.cameraPerspectiveHelper.visible = false;
    }

    this.cameraRig.lookAt(this.mesh.position);
    this.renderer.clear();

    this.activeHelper.visible = false;

    this.renderer.setViewport(0, 0, this.props.width / 2, this.props.height);
    this.renderer.render(this.scene, this.activeCamera);

    this.activeHelper.visible = true;

    this.renderer.setViewport(
      this.props.width / 2,
      0,
      this.props.width / 2,
      this.props.height
    );
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return <div ref="fifth" />;
  }
}
