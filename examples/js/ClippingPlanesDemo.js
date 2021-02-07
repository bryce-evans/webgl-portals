import { Controls } from '/examples/js/utils/Controls.js';
import { PortalMaterial } from '/src/PortalMaterial.js';
import { PortalMesh } from '/src/PortalMesh.js';
import { PortalUtils } from '/src/PortalUtils.js';


class ClippingPlanesDemo {
  constructor() {
    var width = 1024; //window.innerWidth;
    var height = 1024; //window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0x222222, 1);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    document.body.appendChild(this.renderer.domElement);

    var incoming_scene = new THREE.Scene();
    incoming_scene.add(new THREE.AmbientLight(0x444444));
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 1, 1).normalize();
    incoming_scene.add(light);
    this.scene = incoming_scene;

    var outgoing_scene = new THREE.Scene();
    outgoing_scene.add(new THREE.AmbientLight(0x444444));
    var light2 = new THREE.DirectionalLight(0xffffff);
    light2.position.set(0, 1, 1).normalize();
    outgoing_scene.add(light2);
    this.inner_scene = outgoing_scene;

    var camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);

    camera.position.set(80, -6, -30);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.camera = camera;

    this.controls = new Controls(camera, this.renderer);
    this.controls.addListeners();

    let portal_rot = 1 * Math.PI / 6;

    var portal_geo = new THREE.CircleGeometry(5, 64);
    portal_geo.scale(5, 5, 1);
    portal_geo.rotateX(portal_rot);
    var portal_mat = new PortalMaterial(this.inner_scene, camera, this.renderer);
    this.portal = new PortalMesh(portal_geo, portal_mat, { debug_height: 32, debug_width: 32 });

    var ring_geo = new THREE.RingGeometry(4.9, 5, 128);
    ring_geo.scale(5, 5, 1);
    ring_geo.rotateX(portal_rot);
    var ring_mat = new THREE.MeshBasicMaterial({ color: 0xff8800, side: THREE.DoubleSide });
    var ring = new THREE.Mesh(ring_geo, ring_mat);
    // prevent z-fighting.
    ring.position.set(0, 0, 0.01);
    this.scene.add(ring);

    let clip_plane = this.portal.getClippingPlane();
    const geometry = new THREE.TorusKnotGeometry(10, 2.5, 300, 7, 1, 3);

    const material = new THREE.MeshPhongMaterial({ color: 0x00ffff, clipShadows: true, clippingPlanes: [clip_plane] });
    const torusKnot = new THREE.Mesh(geometry, material);
    this.scene.add(torusKnot);

    const geometry2 = new THREE.TorusKnotGeometry(10, 2.5, 300, 7, 1, 3);
    const material2 = new THREE.MeshPhongMaterial({ color: 0x00ffff });
    const torusKnot2 = new THREE.Mesh(geometry2, material2);
    this.inner_scene.add(torusKnot2);

    /// Add them all again

    // portal_geo = new THREE.CircleGeometry(5, 64);
    // portal_geo.scale(5, 5, 1);
    // portal_geo.rotateX(Math.PI - portal_rot);
    // portal_mat = new PortalMaterial(this.inner_scene, camera, this.renderer);
    // this.portal2 = new PortalMesh(portal_geo, portal_mat, { debug_height: 32, debug_width: 32 });

    // ring_geo = new THREE.RingGeometry(4.9, 5, 128);
    // ring_geo.scale(5, 5, 1);
    // ring_geo.rotateX(portal_rot);
    // ring_mat = new THREE.MeshBasicMaterial({ color: 0x0088ff, side: THREE.DoubleSide });
    // ring = new THREE.Mesh(ring_geo, ring_mat);
    // // prevent z-fighting.
    // ring.position.set(0, 0, 0.01);
    // this.scene.add(ring);

    // clip_plane = this.portal2.getClippingPlane();

    // const material2 = new THREE.MeshPhongMaterial({ color: 0x00ffff, clipShadows: true, clippingPlanes: [clip_plane] });
    // const torusKnot2 = new THREE.Mesh(geometry, material);
    // this.scene.add(torusKnot);

    // const geometry2 = new THREE.TorusKnotGeometry(10, 2.5, 300, 7, 1, 3);
    // const material2 = new THREE.MeshPhongMaterial({ color: 0x00ffff });
    // const torusKnot2 = new THREE.Mesh(geometry2, material2);
    // this.inner_scene.add(torusKnot2);

    //////

    const Empty = Object.freeze([]);
    this.renderer.clippingPlanes = Empty; // GUI sets it to globalPlanes
    this.renderer.localClippingEnabled = true;



    this.scene.add(this.portal);
  }

  render() {
    var camera = this.camera;
    var renderer = this.renderer;
    var controls = this.controls;
    var scene = this.scene;
    var portal = this.portal;
    function render_loop() {
      controls.update();
      requestAnimationFrame(render_loop)

      portal.onBeforeRender();

      renderer.render(scene, camera);
    }
    render_loop();
  }
}

export { ClippingPlanesDemo }