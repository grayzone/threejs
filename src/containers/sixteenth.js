import React from "react";
import * as THREE from "three";
import Stats from "stats.js";
import OrbitControls from "orbit-controls-es6";
import * as dat from "dat.gui/build/dat.gui.js";
import MarchingCubes from "../libs/MarchingCubes";

export default class Sixteenth extends React.Component {
  state = {
    aspect: this.props.width / this.props.height,

    camera: {
      positionX: 53,
      positionY: 253,
      positionZ: 153,
      lookX: 113,
      lookY: -67,
      lookZ: 33
    },
    params: {
      width: 200,
      height: 160,
      depth: 160
    }
  };

  componentDidMount = () => {
    this.scene();
    this.renderer();
    this.camera();

    this.objects();

    //  this.light();
    this.datGUI();
    this.stats();

    this.control();

    this.animate();
  };

  scene = () => {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);
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

    controls.target.set(
      this.state.params.width / 2,
      this.state.params.height / 2,
      this.state.params.width / 2
    );

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
    let light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0.5, 0.5, 1);
    this.scene.add(light);

    let ambientLight = new THREE.AmbientLight(0xf0f0f0);
    this.scene.add(ambientLight);

    let pointLight = new THREE.PointLight(0xff3300);
    pointLight.position.set(0, 0, 100);
    this.scene.add(pointLight);
  };

  objects = () => {
    //  this.addPlane();
    //   this.addHelper();
    //  this.addAxis();

    //this.addCubes();

    this.loadRaw();

    console.log("scene:", this.scene.children);
  };

  update = () => {};

  addCubes = () => {
    let cubeObj = new THREE.Object3D();
    cubeObj.name = "cube";
    this.scene.add(cubeObj);
    /*
    let data = [];

    for (let i = 0; i < 513; i++) {
      data[i] = [];
      for (let j = 0; j < 513; j++) {
        data[i][j] = [];
        for (let k = 0; k < 513; k++) {
          data[i][j][k] = Math.random();
        }
      }
    }
*/
    //    console.log("data:", data);
    //  console.log("cube obj:", cubeObj);
    let c = new MarchingCubes(this.dataSource.data, 160, 1);
    //  let c = new MarchingCubes(data, 0.5, 64);
    console.time("render");
    let f = c.render();
    console.timeEnd("render");

   // console.log("f:", f);

    console.time("showFaces");
    this.showFaces(f);
    console.timeEnd("showFaces");
    
    
  };

  showFaces = faces => {
    let geo = new THREE.Geometry();
    let material = new THREE.MeshNormalMaterial({
     // color: 0xcae1c3,
      //      emissive: 0x640707,
      //      shininess: 1,
      //      roughness: 1,
      //      metalness: 1,
      wireframe: false,
      //      flatShading: true,
      opacity: 1,
      side: THREE.FrontSide,
      transparent: true
    });
    for (let i = 0; i < faces.vertex.length; i++) {
      let p = new THREE.Vector3(
        faces.vertex[i][0],
        faces.vertex[i][1],
        faces.vertex[i][2]
      );
      geo.vertices.push(p);
    }
    //    geo.vertices = faces.vertex;
    for (let i = 0; i < faces.face.length; i++) {
      let f = new THREE.Face3(
        faces.face[i][0],
        faces.face[i][1],
        faces.face[i][2]
      );
      geo.faces.push(f);
    }
    geo.computeFaceNormals();
    geo.computeVertexNormals();

    let faceObj = new THREE.Mesh(geo, material);
    faceObj.name = "faces";

    this.scene.add(faceObj);
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
    this.helper = new THREE.GridHelper(1024, 8);
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

  handleRawOnload = data => {
    let array = new Uint8Array(data);
    //   console.log("read mri:", data, array);
    this.dataSource = {};
    this.dataSource.width = this.state.params.width;
    this.dataSource.height = this.state.params.height;
    this.dataSource.depth = this.state.params.depth;
    //    this.dataSource.points = [];
    this.dataSource.data = [];
    let index = 0;
    //   console.log("data source 0 :", this.dataSource);
    for (let i = 0; i < this.dataSource.depth; i++) {
      this.dataSource.data[i] = [];
      for (let j = 0; j < this.dataSource.height; j++) {
        this.dataSource.data[i][j] = [];
        for (let k = 0; k < this.dataSource.width; k++) {
          this.dataSource.data[i][j][k] = array[index];
          index++;
        }
      }
    }
    //   console.log("data source:", this.dataSource);
    this.addCubes();
  };

  handleRawOnProgress = xhr => {
    console.log(xhr.loaded / xhr.total * 100 + "% loaded");
  };

  hanldeRawOnError = xhr => {
    console.log("failed:", xhr);
  };

  loadRaw = () => {
    let loader = new THREE.FileLoader();
    loader.setResponseType("arraybuffer");
    loader.load(
      "data/mri.raw",
      this.handleRawOnload,
      this.handleRawOnProgress,
      this.hanldeRawOnError
    );
  };
}
