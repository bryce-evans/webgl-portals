import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { CubePortalLayout } from './portal_layouts/CubePortalLayout.js';
import { PortalWindow } from './PortalWindow.js';


var MainScene = function () {

  this.init = function () {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0x222222, 1);

    var show_miniscenes = true;

    var width = 1024;
    var height = 1024;
    this.renderer.setSize(width, height);
    document.body.appendChild(this.renderer.domElement);

    var scene = new THREE.Scene();
    scene.add( new THREE.AmbientLight(0xfff));

    var camera = new THREE.OrthographicCamera(width / -80, width / 80, height / 80, height / -80, 1, 1000);
    camera.position.set(11, 11, 11);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.controls = new OrbitControls(camera, this.renderer.domElement);

    var miniscene = new THREE.Scene();
    var dummy_geo = new THREE.DodecahedronGeometry(10);
    var dummy_mat = new THREE.MeshBasicMaterial({ color: new THREE.Color("hsl(0, 100%, 50%)") });
    var dummy_mesh = new THREE.Mesh(dummy_geo, dummy_mat);
    miniscene.add(dummy_mesh)

    var light_color = 0xffffff;
    var light_intensity = 1;
    var light = new THREE.PointLight(light_color, light_intensity);
    light.position.set(0, 3, 15);
    miniscene.add(light);

    miniscene.add( new THREE.AmbientLight(0xfff));

    var portal_geo = new THREE.PlaneGeometry(10, 10, 1);

    var portal = new PortalWindow({ scene: miniscene, portal_geometry: portal_geo });
    portal.setCamera(camera);
    portal.showDebugUVs($("#miniscenes"));
    scene.add(portal);

    var controls = new OrbitControls(camera, this.renderer.domElement);

    //   portal_cube = new CubePortalLayout({size: 10});
    //   portal_cube.setCamera(camera);
    //   for (var i = 0; i < portal_cube.n_windows(); i++) {
    //     portal_cube.setScene(i, new RandomGeometryScene());
    //   }
    //   portal_cube.showFrameGeometry();
    //   scene.add(portal_cube);
    // }

    if (show_miniscenes) {
      portal.showDebugUVs($('#miniscenes'));
    }

    this.render = function () {
      var renderer = this.renderer;
      function render_helper() {
        controls.update();

        requestAnimationFrame(render_helper)

        renderer.render(scene, camera);
      }
      render_helper();
    }
  }
}

var scene = new MainScene();
scene.init();
scene.render();