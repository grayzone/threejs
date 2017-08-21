import React from "react";
import * as THREE from "three";
import Stats from "stats.js";
import OrbitControls from "orbit-controls-es6";
import * as dat from "dat.gui/build/dat.gui.js";


class Cube {
  constructor(obj, position, size, resolution) {
    if (resolution > size) {
      console.error(
        "resolution is too large, size:",
        size,
        ", resolution:",
        resolution
      );
      return;
    }
    if (size % resolution !== 0) {
      console.error(
        "invalid resolution, size:",
        size,
        ",resolution:",
        resolution
      );
      return;
    }
    this.obj = obj;
    this.position = position;
    this.size = size;
    this.resolution = resolution;
  }

  render = () => {
    let blockObj = new THREE.Object3D();
    blockObj.name = "block";
    this.obj.add(blockObj);
    let times = this.size / this.resolution;
    for (let k = 0; k < times; k++) {
      for (let j = 0; j < times; j++) {
        for (let i = 0; i < times; i++) {
          let p = [
            i * this.resolution,
            j * this.resolution,
            k * this.resolution
          ];
          let b = new Grid(blockObj, p, this.resolution);
          b.render();
        }
      }
    }
  };
}

class Grid {
  constructor(obj, position, size, data, threshold) {
    this.obj = obj;
    this.position = position;
    this.size = size;
    this.data = data;
    this.threshold = threshold;

    this.gridIndex(data, threshold);
  }

  render = () => {
    this.getVertex(this.position, this.size);
    //   this.showVertex(obj);

    this.showEdges(this.obj);
    //   this.getSubVertex(obj, size, resolution);
  };

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

  edgeConnection = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7]
  ];

  gridIndex = (data, threshold) => {
    this.gridIndex = 0;
    if (data[0] < threshold) {
      this.gridIndex |= 1;
    }
    if (data[1] < threshold) {
      this.gridIndex |= 2;
    }
    if (data[2] < threshold) {
      this.gridIndex |= 4;
    }
    if (data[3] < threshold) {
      this.gridIndex |= 8;
    }
    if (data[4] < threshold) {
      this.gridIndex |= 16;
    }
    if (data[5] < threshold) {
      this.gridIndex |= 32;
    }
    if (data[6] < threshold) {
      this.gridIndex |= 64;
    }
    if (data[7] < threshold) {
      this.gridIndex |= 128;
    }
  };

  getVertex = (position, size) => {
    //    console.log("vertex offset:", this.vertexOffset);
    this.vertex = [];
    for (let i = 0; i < 8; i++) {
      let p = new THREE.Vector3(
        position[0] + size * this.vertexOffset[i][0],
        position[1] + size * this.vertexOffset[i][1],
        position[2] + size * this.vertexOffset[i][2]
      );
      this.vertex.push(p);
    }
  };

  showVertex = obj => {
    let geo = new THREE.Geometry();
    let material = new THREE.PointsMaterial({
      color: 0x000000,
      size: 30
    });

    geo.vertices = this.vertex;

    let points = new THREE.Points(geo, material);
    let vertexObj = new THREE.Object3D();
    vertexObj.name = "vertex";
    vertexObj.add(points);
    //   points.position.y = 150;
    obj.add(vertexObj);
  };

  showEdges = obj => {
    //    console.log("edge connection:", this.edgeConnection);
    let edgeObj = new THREE.Object3D();
    edgeObj.name = "edges";
    for (let i = 0; i < this.edgeConnection.length; i++) {
      let e = this.edgeConnection[i];
      //   console.log("edge:", e);
      let geo = new THREE.Geometry();
      let material = new THREE.LineBasicMaterial({
        color: 0xff00ff
      });

      for (let j = 0; j < e.length; j++) {
        geo.vertices.push(this.vertex[e[j]]);
      }

      let edge = new THREE.Line(geo, material);
      edge.name = "edge";
      edgeObj.add(edge);
    }
    obj.add(edgeObj);
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

    this.control();

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

    controls.target.set(
      this.props.width / 2,
      this.props.height / 2,
      this.props.width / 2
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
    //  this.addPlane();
    this.addHelper();
    //  this.addAxis();

    this.addCubes();

    console.log("scene:", this.scene.children);
  };

  update = () => {};

  addCubes = () => {
    let cubeObj = new THREE.Object3D();
    cubeObj.name = "cube";
    this.scene.add(cubeObj);
    let pos = [0, 0, 0];
    //  console.log("cube obj:", cubeObj);
    let c = new Cube(cubeObj, pos, 512, 256);
    c.render();
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
