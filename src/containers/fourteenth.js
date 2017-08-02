import React from "react";
import * as THREE from "three";
import Stats from "stats.js";
import OrbitControls from "orbit-controls-es6";
import * as dat from "dat.gui/build/dat.gui.js";
//import MarchingSquares from "../libs/MarchingSquares";

export default class Fourteenth extends React.Component {
  state = {
    aspect: this.props.width / this.props.height
  };

  componentDidMount = () => {
    this.scene();
    this.renderer();
    this.camera();

    this.objects();

    this.light();
    // this.datGUI();
    this.stats();

    //   this.control();

    this.animate();
  };

  scene = () => {
    this.scene = new THREE.Scene();
  };

  addToContainer = element => {
    this.refs.Fourteenth.appendChild(element);
  };

  render = () => {
    return <div ref="Fourteenth" />;
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

    this.addToContainer(gui.domElement);
  };

  camera = () => {
    this.camera = new THREE.OrthographicCamera(
      -this.props.width / 2,
      this.props.width / 2,
      this.props.height / 2,
      -this.props.height / 2,
      -500,
      1000
    );
    this.camera.position.set(0, 0, 100);
  };

  light = () => {
    let ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(ambientLight);
  };

  objects = () => {
    this.addImage();
    this.addVertex();
  };

  addVertex = () => {
    let points = [
      new THREE.Vector3(-256, -256, 0),
      new THREE.Vector3(-256, 256, 0),
      new THREE.Vector3(256, 256, 0),
      new THREE.Vector3(256, -256, 0),
      new THREE.Vector3(0, 0, 0)
    ];
    let geo = new THREE.Geometry();
    geo.vertices = points;
    let material = new THREE.PointsMaterial({
      size: 3,
      color: 0xffff00
    });
    let p = new THREE.Points(geo, material);
    this.scene.add(p);
  };

  addImage = () => {
    let spriteMap = null;
    let geo = new THREE.PlaneGeometry(this.props.width, this.props.height);
    spriteMap = new THREE.ImageUtils.loadTexture("data/ct.png");
    let spriteMaterial = new THREE.MeshBasicMaterial({
      map: spriteMap,
      color: 0xffffff
    });

    let sprite = new THREE.Mesh(geo, spriteMaterial);

    this.scene.add(sprite);
    console.log("image data:", spriteMap.image);
    this.getImageInfo(spriteMap.image);
  };

  getImageInfo = image => {
    let canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;

    var context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);

    let imagedata = context.getImageData(0, 0, image.width, image.height);
    console.log("image data:", imagedata.data);
    let count = 0;
    for (let i = 0; i < imagedata.data.length; i++) {
      let pixel = imagedata.data[i];
      if (pixel > 0) {
        count++;
      }
    }
    console.log("count:", count);
    var data = imagedata.data;
    var pp = [];
    for (let i = 0; i < 512; i++) {
      for (let j = 0; j < 512; j++) {
        var position = (j + imagedata.width * i) * 4;
        let pixel = {
          r: data[position],
          g: data[position + 1],
          b: data[position + 2],
          a: data[position + 3]
        };
        if (pixel.r !== 0 || pixel.g !== 0 || pixel.b !== 0 || pixel.a !== 0) {
          pp.push(pixel);
        }
      }
    }
    console.log("pixel:", pp);
  };

  update = () => {};
}
