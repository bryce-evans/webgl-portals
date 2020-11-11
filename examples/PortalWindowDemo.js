import { Controls } from '/src/Controls.js';
import { PortalWindow } from '/src/PortalWindow.js';


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
    scene.add( new THREE.AmbientLight(0xfff));

    var camera = new THREE.OrthographicCamera(width / -80, width / 80, height / 80, height / -80, 1, 1000);
    camera.position.set(11, 11, 11);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.controls = new Controls(camera, this.renderer.domElement);
    this.controls.addListeners();

    var miniscene = new THREE.Scene();
    var dummy_geo = new THREE.DodecahedronGeometry(3);
    var dummy_mat = new THREE.MeshPhongMaterial({ color: new THREE.Color("hsl(220, 100%, 50%)") });
    var dummy_mesh = new THREE.Mesh(dummy_geo, dummy_mat);
    miniscene.add(dummy_mesh)

    var light_color = 0xffffff;
    var light_intensity = 1;
    var light = new THREE.PointLight(light_color, light_intensity);
    light.position.set(0, 3, 15);
    miniscene.add(light);

    var portal_geo = new THREE.PlaneGeometry(10, 10, 1);

    var portal = new PortalWindow({ scene: miniscene, portal_geometry: portal_geo, renderer: this.renderer });
    portal.setCamera(camera);
    scene.add(portal);

    //   portal_cube = new CubePortalLayout({size: 10});
    //   portal_cube.setCamera(camera);
    //   for (var i = 0; i < portal_cube.n_windows(); i++) {
    //     portal_cube.setScene(i, new RandomGeometryScene());
    //   }
    //   portal_cube.showFrameGeometry();
    //   scene.add(portal_cube);
    // }

    if (show_uv_debug) {
      portal.showDebugUVs($('#debug_uvs'));
    }

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