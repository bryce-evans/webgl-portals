import { ObjectPicker, Controls } from '/examples/js/Controls.js';
import { CubePortalLayout } from '/src/layouts/CubePortalLayout.js';


class PortalCubeDemo {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0x222222, 1);

    var show_uv_debug = true;

    var width = window.innerWidth;
    var height = window.innerHeight;
    this.renderer.setSize(width, height);
    document.body.appendChild(this.renderer.domElement);

    var scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xfff));
    this.scene = scene;

    var camera = new THREE.OrthographicCamera(width / -80, width / 80, height / 80, height / -80, 1, 1000);
    camera.position.set(11, 11, 11);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.camera = camera;

    this.controls = new Controls(camera, this.renderer);
    this.controls.addListeners();

    this.obj_picker = new ObjectPicker(this.renderer.domElement);


    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    function rand(min, max) {
      if (max === undefined) {
        max = min;
        min = 0;
      }
      return min + (max - min) * Math.random();
    }

    function randomColor() {
      return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 50%)`;
    }

    for (let i = 0; i < 20; ++i) {
      const material = new THREE.MeshPhongMaterial({
        color: "hsl(200, 100, 50%)",
      });

      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(rand(-25, 25), rand(-25, 25), rand(-25, 25));
      cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
      cube.scale.set(rand(2, 6), rand(2, 6), rand(2, 6));
      scene.add(cube);
    }


    var cube_scenes = [];
    for (var i = 0; i < CubePortalLayout.maxScenes(); i++) {
      var miniscene = new THREE.Scene();
      const numObjects = 50;
      for (let i = 0; i < numObjects; ++i) {
        const material = new THREE.MeshBasicMaterial({
          color: randomColor(),
        });

        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(rand(-5, 5), rand(-5, 5), rand(-5, 5));
        cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
        cube.scale.set(rand(1, 3), rand(1, 3), rand(1, 3));
        miniscene.add(cube);
      }
      cube_scenes.push(miniscene);
    }

    var portal_cube = new CubePortalLayout(cube_scenes, camera, this.renderer, { size: 10, debug_height: 256, debug_width: 256 });
    scene.add(portal_cube);
    this.portal = portal_cube;

    if (show_uv_debug) {
      portal_cube.renderDebugUVs(true);
    }
  }
  render() {
    var camera = this.camera;
    var renderer = this.renderer;
    var controls = this.controls;
    var scene = this.scene;
    var portal = this.portal;
    var obj_picker = this.obj_picker;
    var time = 0.0;
    function render_loop() {
      time += 0.0001;
      controls.update();
      requestAnimationFrame(render_loop)

      portal.onBeforeRender();
      obj_picker.pick(scene, camera, time);
      renderer.render(scene, camera);
    }
    render_loop();
  }
}

var page = new PortalCubeDemo();
page.render();