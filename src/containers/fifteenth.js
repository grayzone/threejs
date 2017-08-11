import React from "react";
import * as THREE from "three";
import Stats from "stats.js";
import OrbitControls from "orbit-controls-es6";
import * as dat from "dat.gui/build/dat.gui.js";
import MarchingSquares from "../libs/MarchingSquares";

export default class Fifteenth extends React.Component {
  state = {
    aspect: this.props.width / this.props.height,
    params: {
      depth: 80,
      iso: 128,
      marchingSquare: false
    },
    data: [],
    width: 200,
    height: 160,
    left: { x: 1000, y: 0 },
    right: { x: -1000, y: 0 }
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
    this.refs.Fifteenth.appendChild(element);
  };

  render = () => {
    return <div ref="Fifteenth" />;
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
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0x050505);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.props.width, this.props.height);
    this.addToContainer(this.renderer.domElement);
  };

  datGUI = () => {
    let gui = new dat.GUI();
    gui.domElement.style.position = "absolute";
    gui.domElement.style.top = "50px";
    gui.domElement.style.left = "600px";
    gui.domElement.style.minHeight = "100px";

    //  gui.add(this.state.params, "depth", 1, this.state.params.depth);
    var depthControl = gui
      .add(this.state.params, "depth")
      .min(1)
      .max(160)
      .step(1);
    depthControl.onChange(value => {
      //    console.log("depth change:", value);

      this.showSlice();
    });
    let isoControl = gui.add(this.state.params, "iso").min(1).max(256).step(1);
    isoControl.onChange(value => {
      //  console.log("iso change:", value);
      this.showSlice();
    });

    let isMarchingSquare = gui.add(this.state.params, "marchingSquare");
    isMarchingSquare.onChange(value => {
      console.log("is enable marching square:", value);
    });

    this.addToContainer(gui.domElement);
  };

  camera = () => {
    /*
    this.camera = new THREE.OrthographicCamera(
      -this.props.width / 2,
      this.props.width / 2,
      //0,
      this.props.height / 2,
      -this.props.height / 2,
      -100,
      500
    );
    */

    this.camera = new THREE.OrthographicCamera(
      -this.state.width / 2,
      this.state.width / 2,
      this.state.height / 2,
      -this.state.height / 2,
      -100,
      500
    );
    this.camera.position.set(0, 0, 250);
    //   this.camera.lookAt(this.scene.position);
  };

  light = () => {
    let ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(ambientLight);
  };

  objects = () => {
    this.addImage();
    this.addMarchingSquares();
    //   this.addVertex();
  };

  addVertex = () => {};

  addPoints = points => {
    let geo = new THREE.BufferGeometry();
    let material = new THREE.PointsMaterial({
      size: 3,
      color: 0xffff00
    });
    geo.addAttribute("position", new THREE.BufferAttribute(points, 3));
    let pointsObj = new THREE.Points(geo, material);
    this.pointGroup.add(pointsObj);
  };

  addContourLine = (start, end) => {
    let geo = new THREE.Geometry();
    geo.vertices.push(start, end);
    let material = new THREE.LineBasicMaterial({
      color: 0xffff00
    });
    let lineObj = new THREE.Line(geo, material);
    this.scene.add(lineObj);
  };

  addMarchingSquares = () => {
    if (this.state.data.length === 0) {
      return;
    }

    let resolution = 1;
    let data = [];
    for (let j = 0; j < this.state.height / resolution; j++) {
      data[j] = [];
      for (let i = 0; i < this.state.width / resolution; i++) {
        /* let pos = new Float32Array([
          i * resolution - this.state.width / 2,
          j * resolution - this.state.height / 2,
          0
        ]);

        this.addPoints(pos);

        let p = {
          x: i * resolution - this.state.width / 2,
          y: j * resolution - this.state.height / 2,
          z: 0
        };
*/
        data[j][i] = this.getPixelData(resolution * i, resolution * j);

        //     console.log("i,", i, ",j:", j, ",pixel:", d);
      }
    }
    let ms = new MarchingSquares(data, this.state.params.iso);
    let line = ms.getContourLine();
    // for (let i = 0; i < 100; i++) {
    for (let i = 0; i < line.length; i++) {
      let l = line[i];
      //   console.log("line:", line[i]);
      let start = new THREE.Vector3(
        l[0].x - this.state.width / 2,
        l[0].y - this.state.height / 2,
        0
      );
      let end = new THREE.Vector3(
        l[1].x - this.state.width / 2,
        l[1].y - this.state.height / 2,
        0
      );
      this.addContourLine(start, end);
    }
    //    console.log("line:", line);
  };

  getPixelData = (x, y) => {
    let data = this.sliceData();
    //    console.log("Data:", data);
    return data[this.state.width * y + x];
  };

  addMarks = () => {
    let data = this.sliceData();
    if (data.length === 0) {
      return;
    }
    let index = 0;
    for (let j = 0; j < this.state.height; j++) {
      for (let i = 0; i < this.state.width; i++) {
        let v = data[index];
        index++;
        if (v > this.state.params.iso) {
          let p = new Float32Array([
            i - this.state.width / 2,
            j - this.state.height / 2,
            0
          ]);
          /*
          console.log(
            "index:",
            index,
            "mark:",
            p,
            "x:",
            i - this.state.width / 2,
            "y:",
            j - this.state.height / 2,
            "v:",
            v,
            "i:",
            i,
            "j:",
            j
          );
*/
          this.addPoints(p);
          return;
        }
      }
    }
  };

  addLeftAndRight = () => {
    let p = new Float32Array([
      this.state.left.x - 100,
      this.state.left.y - 80,
      0,
      this.state.right.x - 100,
      this.state.right.y - 80,
      0
    ]);
    console.log("left and right:", p);
    this.addPoints(p);
  };

  getDataByDepth = (obj, depth) => {
    if (obj.length === 0) {
      return [];
    }
    let startPos = (depth - 1) * this.state.width * this.state.height;
    return obj.slice(startPos, startPos + this.state.width * this.state.height);
  };

  sliceData = () => {
    let data = this.getDataByDepth(this.state.data, this.state.params.depth);
    for (let i = 0; i < data.length; i++) {
      if (data[i] < this.state.params.iso) {
        data[i] = 0;
      }
    }
    let index = 0;
    for (let j = 0; j < this.state.height; j++) {
      for (let i = 0; i < this.state.width; i++) {
        let value = data[index];
        index++;
        if (value > 0) {
          let left = this.state.left;
          let right = this.state.right;
          if (i < left.x) {
            left.x = i;
            left.y = j;
            this.setState({ left });
          }
          if (i > right.x) {
            right.x = i;
            right.y = j;
            this.setState({ right });
          }
        }
      }
    }

    return data;
  };

  showSlice = () => {
    if (this.state.data.length === 0) {
      return;
    }

    if (this.sliceGroup !== undefined) {
      console.log("slice group:", this.sliceGroup.children.length);
      this.sliceGroup.remove(this.sliceGroup.children[0]);
    }

    if (this.pointGroup !== undefined) {
      console.log("point group:", this.pointGroup.children.length);
      for (let i = 0; i < this.pointGroup.children.length; i++) {
        this.pointGroup.remove(this.pointGroup.children[i]);
      }
    }

    if (this.marchingsquaresGroup !== undefined) {
      console.log(
        "marching square group:",
        this.marchingsquaresGroup.children.length
      );
      for (let i = 0; i < this.marchingsquaresGroup.children.length; i++) {
        this.marchingsquaresGroup.remove(this.marchingsquaresGroup.children[i]);
      }
    }

    this.setState({
      left: { x: 1000, y: 0 },
      right: { x: -1000, y: 0 }
    });

    //   console.log("scene group:", this.scene.children.length);
    //   console.log("slice group:", this.sliceGroup.children.length);
    //   console.log("point group:", this.pointGroup.children.length);

    let textTure = new THREE.DataTexture(
      this.sliceData(),
      this.state.width,
      this.state.height
    );

    textTure.format = THREE.LuminanceFormat;
    textTure.type = THREE.UnsignedByteType;

    let geo = new THREE.PlaneGeometry(this.state.width, this.state.height);

    let spriteMaterial = new THREE.MeshBasicMaterial({
      map: textTure,
      //     color: 0xffffff,
      transparent: true
    });
    textTure.needsUpdate = true;
    let sliceObj = new THREE.Mesh(geo, spriteMaterial);
    this.sliceGroup.add(sliceObj);

    //    this.addMarks();
    //    this.addLeftAndRight();

    this.addMarchingSquares();
  };

  handleRawOnload = data => {
    let array = new Uint8Array(data);
    this.setState({
      data: array
    });

    this.sliceGroup = new THREE.Object3D();
    this.scene.add(this.sliceGroup);

    this.pointGroup = new THREE.Object3D();
    this.scene.add(this.pointGroup);

    this.marchingsquaresGroup = new THREE.Object3D();
    this.scene.add(this.marchingsquaresGroup);

    this.showSlice();
  };

  handleRawOnProgress = xhr => {
    console.log(xhr.loaded / xhr.total * 100 + "% loaded");
  };

  hanldeRawOnError = xhr => {
    console.log("Raw load failed, ", xhr);
  };

  addImage = () => {
    let loader = new THREE.FileLoader();
    loader.setResponseType("arraybuffer");
    loader.load(
      "data/mri.raw",
      this.handleRawOnload,
      this.handleRawOnProgress,
      this.hanldeRawOnError
    );
  };

  update = () => {
    //   this.showSlice();
  };
}
