import React from "react";
import * as THREE from "three";
import Stats from "stats.js";
import OrbitControls from "orbit-controls-es6";
import * as dat from "dat.gui/build/dat.gui.js";

class Cube {
  constructor(obj, position, size, resolution) {
    this.position = position;
    this.getVectics(obj, position, size);
  }

  vertexOffset = [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 1, 1]
  ];

  getVectics = (obj, position, size) => {
    console.log("vertex offset:", this.vertexOffset);
    this.vectics = [];
    for (let i = 0; i < 8; i++) {
      let p = new THREE.Vector3(
        size * this.vertexOffset[i][0],
        size * this.vertexOffset[i][1],
        size * this.vertexOffset[i][2]
      );
      this.vectics.push(p);
    }

    let geo = new THREE.Geometry();
    let material = new THREE.PointsMaterial({
      color: 0x422921,
      size: 10
    });

    geo.vertices = this.vectics;

    let points = new THREE.Points(geo, material);
    //   points.position.y = 150;
    obj.add(points);
  };
}

export default class Sixteenth extends React.Component {
  state = {
    aspect: this.props.width / this.props.height,

    camera: {
      positionX: -337,
      positionY: 653,
      positionZ: 734,
      lookX: -74,
      lookY: 471,
      lookZ: 471
    }
  };

  componentDidMount = () => {
    this.scene();
    this.renderer();
    this.camera();

    this.objects();

    this.light();
    this.datGUI();
    this.stats();

    //    this.control();

    this.animate();
  };

  scene = () => {
    this.scene = new THREE.Scene();
  };

  addToContainer = element => {
    this.refs.Sixteenth.appendChild(element);
  };

  render = () => {
    return <div ref="Sixteenth" />;
  };

  animate = () => {
    this.stats.begin();
    this.update();
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
    requestAnimationFrame(this.animate);
  };

  stats = () => {
    this.stats = new Stats();
    //   this.stats.showPanel(1);
    this.stats.dom.style.position = "absolute";
    this.stats.dom.style.top = "0px";
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
    gui.domElement.style.top = "50px";
    gui.domElement.style.left = "600px";
    gui.domElement.style.minHeight = "300px";

    let camera = gui.addFolder("Camera");

    camera
      .add(this.state.camera, "positionX")
      .step(1)
      .min(-1024)
      .max(1024)
      .onChange(this.changeCamera);
    camera
      .add(this.state.camera, "positionY")
      .step(1)
      .min(-1024)
      .max(1024)
      .onChange(this.changeCamera);
    camera
      .add(this.state.camera, "positionZ")
      .step(1)
      .min(-1024)
      .max(1024)
      .onChange(this.changeCamera);
    camera
      .add(this.state.camera, "lookX")
      .step(1)
      .min(-1024)
      .max(1024)
      .onChange(this.changeCamera);
    camera
      .add(this.state.camera, "lookY")
      .step(1)
      .min(-1024)
      .max(1024)
      .onChange(this.changeCamera);
    camera
      .add(this.state.camera, "lookZ")
      .step(1)
      .min(-1024)
      .max(1024)
      .onChange(this.changeCamera);
    /*
    gui
      .add(this.state.params, "near")
      .step(1)
      .min(-1024)
      .max(1024)
      .onChange(this.changeCamera);

    gui
      .add(this.state.params, "far")
      .step(1)
      .min(-1024)
      .max(10240)
      .onChange(this.changeCamera);
*/
    this.addToContainer(gui.domElement);
  };

  camera = () => {
    this.camera = new THREE.PerspectiveCamera(70, this.state.aspect, 1, 10000);
    this.camera.position.set(
      this.state.camera.positionX,
      this.state.camera.positionY,
      this.state.camera.positionZ
    );

    this.camera.lookAt(
      new THREE.Vector3(
        this.state.camera.lookX,
        this.state.camera.lookY,
        this.state.camera.lookZ
      )
    );
  };

  changeCamera = () => {
    this.camera.position.set(
      this.state.camera.positionX,
      this.state.camera.positionY,
      this.state.camera.positionZ
    );
    this.camera.lookAt(
      new THREE.Vector3(
        this.state.camera.lookX,
        this.state.camera.lookY,
        this.state.camera.lookZ
      )
    );

    this.camera.updateProjectionMatrix();
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
    this.addPlane();
    this.addHelper();
    this.addAxis();

    this.addCubes();

    console.log("scene:", this.scene);
  };

  update = () => {};

  addCubes = () => {
    let cubesObj = new THREE.Object3D();
    this.scene.add(cubesObj);
    let pos = [0, 0, 0];
    let c = new Cube(this.scene, pos, 512, 1);
  };

  addPlane = () => {
    let geo = new THREE.PlaneGeometry(1024, 1024);
    geo.rotateX(-Math.PI / 2);
    let m = new THREE.ShadowMaterial({
      opacity: 0.2
    });
    this.plane = new THREE.Mesh(geo, m);
    //    this.plane.position.x = 1000;
    this.plane.receiveShadow = true;
    this.scene.add(this.plane);
  };

  addHelper = () => {
    this.helper = new THREE.GridHelper(1024, 64);
    //      this.helper.position.x = 1000;
    this.helper.material.opacity = 0.25;
    this.helper.material.transparent = true;
    this.scene.add(this.helper);
  };

  addAxis = () => {
    this.axis = new THREE.AxisHelper();
    //    this.axis.position.set(1000, 0, 0);
    this.scene.add(this.axis);
  };
}
