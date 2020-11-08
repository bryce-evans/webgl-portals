import { Controls } from './Controls.js';
import { CubePortalLayout } from './portal_layouts/CubePortalLayout.js';


MainScene = function () {

  this.init = function () {
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x222222, 1);

    var width = 1024;
    var height = 1024;
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    var scene = new THREE.Scene();

    var camera = new THREE.OrthographicCamera(width / -80, width / 80, height / 80, height / -80, 1, 1000);
    camera.position.set(11, 11, 11);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.controls = new Controls(camera, renderer.domElement);

    portal_cube = CubePortalLayout(size = 10);
    portal_cube.setCamera(camera);
    for (var i = 0; i < portal_cube.n_windows(); i++) {
      portal_cube.setScene(i, new RandomGeometryScene());
    }
    portal_cube.showFrameGeometry();
    scene.add(portal_cube);
  }

  this.render = function () {
    controls.update();
    requestAnimationFrame(render);

    if (show_miniscenes) {
      portal_cube.renderDebugTextureUVs($('#miniscenes'));
    }

    renderer.render(scene, camera);
  }
}

scene = new MainScene();
scene.init();
scene.render();