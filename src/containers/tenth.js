import React from "react";
import * as THREE from "three";
import Stats from "stats.js";
import OrbitControls from "orbit-controls-es6";
import * as dat from "dat.gui/build/dat.gui.js";

export default class Tenth extends React.Component {
  state = {
    aspect: this.props.width / this.props.height,
    segments: 200,
    splinePointLength: 4,
    positions: [],
    params: {
      helper: true,
      plane: true,
      axis: true
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
    this.refs.tenth.appendChild(element);
  };

  animate = () => {
    this.stats.begin();
    this.update();
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
    requestAnimationFrame(this.animate);
  };

  render = () => {
    const props = {
      name: "file"
    };
    return (
      <div>
        <input
          type="file"
          id="uploadRawFile"
          onChange={this.handleInputChange}
        />
        <div ref="tenth" />
      </div>
    );
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

    this.addToContainer(gui.domElement);
  };

  camera = () => {
    this.camera = new THREE.PerspectiveCamera(100, this.state.aspect, 1, 10000);
    this.camera.position.set(200, 0, 256);
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
    //    this.addPoints();
  };

  addPlane = () => {
    let geo = new THREE.PlaneGeometry(2000, 2000);
    geo.rotateX(-Math.PI / 2);
    let m = new THREE.ShadowMaterial({
      opacity: 0.2
    });
    this.plane = new THREE.Mesh(geo, m);
    this.plane.position.y = -200;
    this.plane.receiveShadow = true;
    this.scene.add(this.plane);
  };

  addHelper = () => {
    this.helper = new THREE.GridHelper(2000, 100);
    this.helper.position.y = -199;
    this.helper.material.opacity = 0.25;
    this.helper.material.transparent = true;
    this.scene.add(this.helper);
  };

  addAxis = () => {
    this.axis = new THREE.AxisHelper();
    this.axis.position.set(-500, -500, -500);
    this.scene.add(this.axis);
  };

  handleInputChange = e => {
    this.loadDataSource();
    //    this.addPoints();
  };

  addPoints = () => {
    //   this.loadDataSource();
    console.log("points number:", this.dataSource.points.length);
    if (this.dataSource.points.length === 0) {
      return;
    }

    let geo = new THREE.BufferGeometry();
    let material = new THREE.PointsMaterial({
      vertexColors: THREE.VertexColors
    });

    let positions = new Float32Array(this.dataSource.points.length * 3);
    let colors = new Float32Array(this.dataSource.points.length * 3);

    for (let i = 0; i < this.dataSource.points.length; i++) {
      positions[3 * i] = this.dataSource.points[i].x;
      positions[3 * i + 1] = this.dataSource.points[i].y;
      positions[3 * i + 2] = this.dataSource.points[i].z;
      colors[3 * i] = this.dataSource.points[i].value / 255;
      colors[3 * i + 1] = this.dataSource.points[i].value / 255;
      colors[3 * i + 2] = this.dataSource.points[i].value / 255;
    }

    console.log("colors:", colors);

    geo.addAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.addAttribute("color", new THREE.BufferAttribute(colors, 3));

    geo.computeBoundingSphere();

    let mesh = new THREE.Points(geo, material);
    mesh.castShadow = true;
    this.scene.add(mesh);
  };
  loadDataSource = () => {
    if (
      !window.File ||
      !window.FileReader ||
      !window.FileList ||
      !window.Blob
    ) {
      console.error("The File APIs are not fully supported in this browser.");
      return;
    }

    this.dataSource = {};
    this.dataSource.min = 256;
    this.dataSource.max = -1;
    this.dataSource.width = 200;
    this.dataSource.height = 160;
    this.dataSource.depth = 160;
    this.dataSource.points = [];
    let input = document.getElementById("uploadRawFile");
    let f = input.files[0];
    console.log("file:", f);
    let reader = new FileReader();
    reader.readAsBinaryString(f);
    reader.onload = e => {
      let index = 0;
      for (let i = 0; i < this.dataSource.depth; i++) {
        for (let j = 0; j < this.dataSource.height; j++) {
          for (let k = 0; k < this.dataSource.width; k++) {
            let value = reader.result.charCodeAt(index);
            index++;
            if (value === 0) {
              continue;
            }
            let p = {};
            p.x = k;
            p.y = j;
            p.z = i;
            p.value = value;
            this.dataSource.points.push(p);
            if (value < this.dataSource.min) {
              this.dataSource.min = value;
            }
            if (value > this.dataSource.max) {
              this.dataSource.max = value;
            }
          }
        }
      }
      this.addPoints();
      console.log("data source:", this.dataSource);
    };
  };

  update = () => {};
}
