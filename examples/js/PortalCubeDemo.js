import { Controls } from '/src/Controls.js';
import { CubePortalLayout } from '/src/layouts/CubePortalLayout.js';
import {RandomGeometryScene} from '/src/scenes/RandomGeometryScene.js';


var MainScene = function () {

  this.init = function () {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0x222222, 1);

    var show_uv_debug = true;

    var width = 1024;
    var height = 1024;
    this.renderer.setSize(width, height);
    document.body.appendChild(this.renderer.domElement);

    var scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xfff));

    var camera = new THREE.OrthographicCamera(width / -80, width / 80, height / 80, height / -80, 1, 1000);
    camera.position.set(11, 11, 11);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.controls = new Controls(camera, this.renderer.domElement);
    this.controls.addListeners();


    var cube_scenes = [];
    for (var i = 0; i < CubePortalLayout.maxScenes(); i++) {
      cube_scenes.push(new RandomGeometryScene());
    }

    var portal_cube = new CubePortalLayout(cube_scenes, camera, this.renderer, { size: 10 });
    //portal_cube.showFrameGeometry();
    scene.add(portal_cube);

    // if (show_uv_debug) {
    //   portal_cube.showDebugUVs($('#debug_uvs'));
    // }

    this.render = function () {
      var renderer = this.renderer;
      var controls = this.controls;
      function render_loop() {
        controls.update();
        requestAnimationFrame(render_loop)
        renderer.render(scene, camera);
      }
      render_loop();
    }
  }
}

var scene = new MainScene();
scene.init();
scene.render();