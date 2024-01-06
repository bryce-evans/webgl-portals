import { CubePortalLayout } from '../../src/layouts/CubePortalLayout.js';
import { RandomGeometryScene } from './utils/RandomGeometryScene.js';
import { OrbitControls } from '../../../modules/three.js/examples/jsm/controls/OrbitControls.js';


class CubeScene {
    constructor(target, scenes, has_perspective_corrected) {
        target = target || document.body;
        let width = target.offsetWidth / 2;
        let height = target.offsetHeight;

        let renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor(0xffffff, 1);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        renderer.domElement.style.display = "inline-block";
        target.appendChild(renderer.domElement);
        this.renderer = renderer;

        let scene = new THREE.Scene();
        scene.add(new THREE.AmbientLight(0xffffff));
        this.scene = scene;

        let camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
        camera.position.set(11, 11, 11);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.camera = camera;

        const portal_render_resolution = 1048 * window.devicePixelRatio;
        let portal_cube = new CubePortalLayout(scenes, camera, renderer, { size: 10, resolution_height: portal_render_resolution, resolution_height: portal_render_resolution, debug_height: 256, debug_width: 256 });

        if (!has_perspective_corrected) {
            // Undo the perspective correction.
            portal_cube.portal_materials.forEach((m) =>
                m.onBeforeCompile = () => void 0
            );
        }

        scene.add(portal_cube);
        scene.add(portal_cube.wireGeometry());
        this.portal = portal_cube;

        let show_uv_debug = true;
        if (show_uv_debug) {
            portal_cube.renderDebugUVs(true, $("#debug_uvs"));
        }
    }
}

class PerspectiveCameraTest {
    constructor() {

        let scenes = [];
        for (let i = 0; i < CubePortalLayout.maxScenes(); i++) {
            scenes.push(new RandomGeometryScene({ "size": 5 }));
        }

        this.scene_left = new CubeScene(document.body, scenes, false);
        this.scene_right = new CubeScene(document.body, scenes, true);

        this.controls = new OrbitControls(this.scene_left.camera, document.body);
    }

    render() {
        let scene_left = this.scene_left;
        let scene_right = this.scene_right;
        let controls = this.controls;

        function render_loop() {
            controls.update();
            requestAnimationFrame(render_loop)

            scene_right.camera.position.copy(scene_left.camera.position);
            scene_right.camera.rotation.copy(scene_left.camera.rotation);

            scene_left.portal.onBeforeRender();
            scene_right.portal.onBeforeRender();
            
            scene_left.renderer.render(scene_left.scene, scene_left.camera);
            scene_right.renderer.render(scene_right.scene, scene_right.camera);
        }
        render_loop();
    }
}

export { PerspectiveCameraTest }
