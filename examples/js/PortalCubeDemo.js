import * as THREE from 'three';
import { ObjectPicker, Controls } from '/examples/js/utils/Controls.js';
import { CubePortalLayout } from '/examples/js/layouts/CubePortalLayout.js';
import { RandomGeometryScene } from '/examples/js/utils/RandomGeometryScene.js';


class PortalCubeDemo {
  constructor() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0x222222, 1);
    //this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    //this.renderer.autoClear = false;
    document.body.appendChild(this.renderer.domElement);

    var show_uv_debug = true;

    var scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff));
    this.scene = scene;

    var camera = new THREE.OrthographicCamera(width / -80, width / 80, height / 80, height / -80, 1, 1000);
    camera.position.set(11, 11, 11);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.camera = camera;

    this.controls = new Controls(camera, this.renderer);
    this.controls.addListeners();

    this.obj_picker = new ObjectPicker(this.renderer.domElement);

    var cube_scenes = [];
    for (var i = 0; i < CubePortalLayout.maxScenes(); i++) {
      cube_scenes.push(new RandomGeometryScene({ "size": 5 }));
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
    function render_loop() {
      controls.update();
      requestAnimationFrame(render_loop)

      portal.onBeforeRender();
      obj_picker.pick(scene, camera, 0);
      renderer.render(scene, camera);
    }
    render_loop();
  }
}

export { PortalCubeDemo };