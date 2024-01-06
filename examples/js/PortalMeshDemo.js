import { Controls } from '/examples/js/utils/Controls.js';
import { PortalMaterial } from '/src/PortalMaterial.js';
import { PortalMesh } from '/src/PortalMesh.js';

class PortalMeshDemo {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0x222222, 1);

    var width = 1024;
    var height = 1024;
    this.renderer.setSize(width, height);
    document.body.appendChild(this.renderer.domElement);

    var scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xfff));

    var camera = new THREE.OrthographicCamera(width / -80, width / 80, height / 80, height / -80, 1, 1000);
    camera.position.set(11, 11, 11);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.controls = new Controls(camera, this.renderer);
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

    this.miniscene = miniscene;

    var portal_geo = new THREE.PlaneGeometry(10, 10, 1);
    var portal_mat = new PortalMaterial(miniscene, camera, this.renderer);

    this.buffer_texture = portal_mat.buffer_texture;

    var portal = new PortalMesh(portal_geo, portal_mat, { "debug_width": 256, "debug_height": 256 });
    portal.renderDebugUVs(true, $("#debug_uvs"));
    scene.add(portal);

    this.camera = camera;
    this.scene = scene;
    this.portal = portal;
    this.portal_mat = portal_mat;
  }

  render() {
    var renderer = this.renderer;
    var scene = this.scene;
    var camera = this.camera;
    var portal = this.portal;
    var controls = this.controls;

    function render_loop() {
      controls.update();
      requestAnimationFrame(render_loop);

      portal.onBeforeRender(renderer);
      renderer.render(scene, camera);
    }
    render_loop();
  }
}

export { PortalMeshDemo }
