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
    portal_geo.translate(0,0, 10);
    var portal_mat = new PortalMaterial(this.inner_scene, camera, this.renderer);
    this.portal = new PortalMesh(portal_geo, portal_mat, { debug_height: 256, debug_width: 256 });
    this.portal.renderDebugUVs(true);

    var ring_geo = new THREE.RingGeometry(4.9, 5, 128);
    ring_geo.scale(5, 5, 1);
    ring_geo.rotateX(portal_rot);
    ring_geo.translate(0,0,10);
    var ring_mat = new THREE.MeshBasicMaterial({ color: 0xff8800, side: THREE.DoubleSide });
    var ring = new THREE.Mesh(ring_geo, ring_mat);
    // prevent z-fighting.
    ring.position.set(0, 0, 0.01);
    this.scene.add(ring);

    let clip_plane = this.portal.getClippingPlane();
    const geometry = new THREE.TorusKnotGeometry(10, 2.5, 300, 7, 1, 3);

    const material = new THREE.MeshPhongMaterial({ color: 0x00ffff, clipShadows: true, clippingPlanes: [clip_plane] });
    const torusKnot = new THREE.Mesh(geometry, material);
    torusKnot.position.z = 10;
    this.scene.add(torusKnot);

    const geometry2 = new THREE.TorusKnotGeometry(10, 2.5, 300, 7, 1, 3);
    const material2 = new THREE.MeshPhongMaterial({ color: 0x00ffff });
    const torusKnot2 = new THREE.Mesh(geometry2, material2);
    torusKnot2.position.z = 10;
    this.inner_scene.add(torusKnot2);

    /// Add them all again

    var inner_scene2 = new THREE.Scene();
    inner_scene2.add(new THREE.AmbientLight(0x444444));
    var light3 = new THREE.DirectionalLight(0xffffff);
    light3.position.set(0, 1, 1).normalize();
    inner_scene2.add(light3);
    this.inner_scene2 = inner_scene2;

    portal_geo = new THREE.CircleGeometry(5, 64);
    portal_geo.scale(5, 5, 1);
    portal_geo.rotateX(Math.PI + portal_rot);
    portal_geo.translate(0,0,-20);
    portal_mat = new PortalMaterial(this.inner_scene, camera, this.renderer);
    this.portal2 = new PortalMesh(portal_geo, portal_mat, { debug_height: 256, debug_width: 256 });
    this.portal2.renderDebugUVs(true);

    ring_geo = new THREE.RingGeometry(4.9, 5, 128);
    ring_geo.scale(5, 5, 1);
    ring_geo.rotateX(Math.PI + portal_rot);
    ring_geo.translate(0,0,-20);
    ring_mat = new THREE.MeshBasicMaterial({ color: 0x0088ff, side: THREE.DoubleSide });
    ring = new THREE.Mesh(ring_geo, ring_mat);
    // prevent z-fighting.
    ring.position.set(0, 0, 0.01);
    this.scene.add(ring);

    let clip_plane2 = this.portal2.getClippingPlane();

    const geometry3 = new THREE.TorusKnotGeometry(10, 2.5, 300, 7, 1, 3);
    // geometry3.translate(0,0,-20);
    const material3 = new THREE.MeshPhongMaterial({ color: 0x00ffff, clipShadows: true, clippingPlanes: [clip_plane2] });
    const torusKnot3 = new THREE.Mesh(geometry3, material3);
    torusKnot3.position.set(0,0,-20);
    // this.moving = torusKnot3;
    this.scene.add(torusKnot3);


    var geometry4 = new THREE.TorusKnotGeometry(10, 2.5, 300, 7, 1, 3);
    var material4 = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    var torusKnot4 = new THREE.Mesh(geometry4, material4);
    torusKnot4.position.set(0,0,-20);
    this.inner_scene.add(torusKnot4);

    geometry4 = new THREE.TorusKnotGeometry(10, 2.5, 300, 7, 1, 3);
    material4 = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    torusKnot4 = new THREE.Mesh(geometry4, material4);
    torusKnot4.position.set(0,0,-20);
    inner_scene2.add(torusKnot4);

    //////

    //const Empty = Object.freeze([]);
    //this.renderer.clippingPlanes = Empty; // GUI sets it to globalPlanes
    this.renderer.localClippingEnabled = true;



    this.scene.add(this.portal);
  }

  render() {
    var camera = this.camera;
    var renderer = this.renderer;
    var controls = this.controls;
    var scene = this.scene;
    var portal = this.portal;
    var moving = this.moving;
    function render_loop() {
      controls.update();
      requestAnimationFrame(render_loop)

      // moving.position.z -= 0.05;


      portal.onBeforeRender();

      renderer.render(scene, camera);
    }
    render_loop();
  }
}

export { ClippingPlanesDemo }