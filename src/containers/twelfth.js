import React from "react";
import * as THREE from "three";
import Stats from "stats.js";
import OrbitControls from "orbit-controls-es6";
import * as dat from "dat.gui/build/dat.gui.js";

export default class Twelfth extends React.Component {
  state = {
    aspect: this.props.width / this.props.height,
    segments: 1000,
    points: [
      new THREE.Vector3(-40.2, -34.7, 0),
      new THREE.Vector3(-60.8, -70.8, 0),
      new THREE.Vector3(-40.5, 30.2, 0),
      new THREE.Vector3(15.4, 60.1, 0),
      new THREE.Vector3(36.6, 53.8, 0),
      new THREE.Vector3(50.9, -90.5, 0),
      new THREE.Vector3(30.2, -20.6, 0)
    ],
    volume: {
      width: 100,
      height: 100,
      depth: 1
    }
  };

  componentDidMount = () => {
    this.scene();
    this.renderer();
    this.camera();

    this.objects();

    this.light();
    // this.datGUI();
    this.stats();

    this.control();

    this.animate();
  };

  scene = () => {
    this.scene = new THREE.Scene();
  };

  addToContainer = element => {
    this.refs.twelfth.appendChild(element);
  };

  animate = () => {
    this.stats.begin();
    this.update();
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
    requestAnimationFrame(this.animate);
  };

  render = () => {
    return <div ref="twelfth" />;
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
    //    this.renderer.gammaInput = true;
    //    this.renderer.gammaOutput = true;

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
    this.camera = new THREE.PerspectiveCamera(100, this.state.aspect, 1, 10000);
    this.camera.position.set(0, 0, 100);
    this.camera.updateMatrixWorld();
  };

  light = () => {
    let light = new THREE.DirectionalLight(0xffff00);
    light.position.set(0.5, 0.5, 1);
    this.scene.add(light);

    let pointLight = new THREE.PointLight(0xff3300);
    pointLight.position.set(0, 0, 100);
    this.scene.add(pointLight);

    let ambientLight = new THREE.AmbientLight(0x080808);
    this.scene.add(ambientLight);
  };

  objects = () => {
    this.generatePoints();
    //   this.addPlane();
    //   this.addHelper();
    //   this.addAxis();
    //   this.addEdges();

    this.addCurve();
    this.addShape();
    //    this.addFaces();
    this.addCrossPoints();

    this.checkIntersects();
  };

  addPlane = () => {
    let geo = new THREE.PlaneGeometry(100, 100);
    //    geo.rotateZ(-Math.PI / 2);
    let m = new THREE.ShadowMaterial({
      opacity: 0.2
    });
    this.plane = new THREE.Mesh(geo, m);
    this.plane.position.x = 0;
    //    this.plane.receiveShadow = true;
    this.scene.add(this.plane);
  };

  addHelper = () => {
    this.helper = new THREE.GridHelper(200, 10);
    this.helper.lookAt(new THREE.Vector3(0, 1, 0));
    this.helper.material.opacity = 0.25;
    this.helper.material.transparent = true;
    this.scene.add(this.helper);
  };

  addAxis = () => {
    this.axis = new THREE.AxisHelper();
    this.axis.position.set(0, 0, 0);
    this.scene.add(this.axis);
  };

  generatePoints = () => {
    let curve = new THREE.CatmullRomCurve3(this.state.points);
    curve.closed = true;
    this.pointsOnCurve = curve.getPoints(this.state.segments);
  };

  addCurve = () => {
    var geo = new THREE.Geometry();
    geo.vertices = this.pointsOnCurve;
    let material = new THREE.LineBasicMaterial();

    this.curveObj = new THREE.Line(geo, material);
    geo.computeBoundingBox();
    this.scene.add(this.curveObj);
  };

  addShape = () => {
    let shape = new THREE.Shape();
    shape.moveTo(this.pointsOnCurve[0].x, this.pointsOnCurve[0].y);
    for (let i = 1; i < this.pointsOnCurve.length; i++) {
      shape.lineTo(this.pointsOnCurve[i].x, this.pointsOnCurve[i].y);
    }
    shape.lineTo(this.pointsOnCurve[0].x, this.pointsOnCurve[0].y);
    let shapeGeo = new THREE.ShapeGeometry(shape);
    let shapeMaterial = new THREE.MeshBasicMaterial({
      opacity: 0,
      color: "orange"
    });
    this.shapeObj = new THREE.Mesh(shapeGeo, shapeMaterial);
    this.scene.add(this.shapeObj);
  };

  addFaces = () => {
    var meshGeo = new THREE.Geometry();
    meshGeo.vertices = this.pointsOnCurve;
    let f1 = new THREE.Face3(
      10,
      20,
      30,
      null,
      new THREE.Color(Math.random() * 0xffffff)
    );
    meshGeo.faces.push(f1);

    meshGeo.computeFaceNormals();
    //geo.computeVertexNormals();

    let mesh = new THREE.Mesh(
      meshGeo,
      new THREE.MeshBasicMaterial({
        vertexColors: THREE.FaceColors,
        side: THREE.DoubleSide,
        opacity: 0.01
        //      transparent: true
      })
    );
    this.scene.add(mesh);
  };

  addEdges = () => {
    // edges on Curve
    let geo = new THREE.Geometry();
    geo.vertices = this.state.points;

    let materialpoints = new THREE.PointsMaterial({
      //     color: new THREE.Color(Math.random() * 0xffffff),
      opacity: 0.5,
      size: 2
    });
    let edges = new THREE.Points(geo, materialpoints);
    this.scene.add(edges);
  };

  addCrossPoints = () => {
    this.crossPoints = [];

    for (let i = 0; i <= 10; i++) {
      for (let j = 0; j <= 10; j++) {
        let geo = new THREE.Geometry();
        let p = new THREE.Vector3(20 * j - 100, 100 - 20 * i, 0);
        geo.vertices.push(p);
        let material = new THREE.PointsMaterial();
        let crossPoint = new THREE.Points(geo, material);
        this.scene.add(crossPoint);
        this.crossPoints.push(crossPoint);
      }
    }
  };

  checkIntersects = () => {
    let rayCaster = new THREE.Raycaster();
    for (let i = 0; i <= 10; i++) {
      for (let j = 0; j <= 10; j++) {
        let position = new THREE.Vector2(
          (20 * j - 100) / 100,
          (100 - 20 * i) / 100
        );
        rayCaster.setFromCamera(position, this.camera);
        let objs = [];
        //     objs = this.crossPoints;
        objs.push(this.shapeObj);
        //objs.push(this.curveObj);
        //      objs.push(this.crossPoints);
        var intersects = rayCaster.intersectObjects(objs, true);
        if (intersects.length === 0) {
          continue;
        }
        console.log(
          "x:",
          20 * j - 100,
          ",y:",
          100 - 20 * i,
          ",i:",
          i,
          ",j:",
          j,
          "intersects number:",
          intersects.length,
          intersects
        );
        let index = i * 11 + j;
        this.crossPoints[index].material.color.set(0xffff00);
        this.crossPoints[index].material.size = 5;
      }
    }
  };

  update = () => {};
}
