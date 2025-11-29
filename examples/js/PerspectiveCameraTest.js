import * as THREE from 'three';
import { CubePortalLayout } from '../../examples/js/layouts/CubePortalLayout.js';
import { RandomGeometryScene } from './utils/RandomGeometryScene.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


class CubeScene {
    constructor(target, scenes, has_perspective_corrected, debug_mode) {
        target = target || document.body;
        this.debug_mode = debug_mode || false;
        let width = this.debug_mode ? target.offsetWidth : target.offsetWidth / 2;
        let height = target.offsetHeight;

        let renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor(0xffffff, 1);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        renderer.domElement.style.display = "inline-block";
        renderer.depth = 0;
        renderer.max_depth = 3;
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

        if (this.debug_mode) {
            // Debug mode: just show the internal scenes directly
            for (let i = 0; i < scenes.length; i++) {
                scene.add(scenes[i]);
            }
            this.portal = null;
        } else {
            let portal_cube = new CubePortalLayout(scenes, camera, renderer, { size: 10, resolution_width: portal_render_resolution, resolution_height: portal_render_resolution, debug_height: 256, debug_width: 256 });

            if (!has_perspective_corrected) {
                // Undo the perspective correction.
                portal_cube.portal_materials.forEach((m) => {
                    m.onBeforeCompile = () => void 0;
                    m.userData.disablePerspectiveCorrection = true;
                });
            }

            scene.add(portal_cube);
            scene.add(portal_cube.wireGeometry());
            this.portal = portal_cube;

            let show_uv_debug = true;
            if (show_uv_debug) {
                portal_cube.renderDebugUVs(true, $("#debug_uvs")[0]);
            }
        }
    }
}

class PerspectiveCameraTest {
    constructor() {
        // Debug modes:
        // false - normal mode (side by side comparison)
        // 'internal_scenes' - show internal scenes directly
        // 'uv_debug' - show UV projection visualization
        const DEBUG_MODE = false;

        let scenes = [];
        for (let i = 0; i < CubePortalLayout.maxScenes(); i++) {
            scenes.push(new RandomGeometryScene({ "size": 5 }));
        }

        if (DEBUG_MODE === 'internal_scenes') {
            this.scene_left = new CubeScene(document.body, scenes, false, true);
            this.scene_right = null;
        } else if (DEBUG_MODE === 'uv_debug') {
            // Show left side only with UV debugging enabled
            this.scene_left = new CubeScene(document.body, scenes, false, true);
            this.scene_right = null;
            console.log('UV Debug Mode: Open browser console and check debug_uvs div');
        } else {
            this.scene_left = new CubeScene(document.body, scenes, false);
            this.scene_right = new CubeScene(document.body, scenes, true);
        }

        this.controls = new OrbitControls(this.scene_left.camera, document.body);
    }

    render() {
        let scene_left = this.scene_left;
        let scene_right = this.scene_right;
        let controls = this.controls;

        function render_loop() {
            controls.update();
            requestAnimationFrame(render_loop)

            // scene_left.camera.updateProjectionMatrix();
            scene_left.camera.updateMatrixWorld();
            scene_left.renderer.depth = 0;
            scene_left.renderer.render(scene_left.scene, scene_left.camera);
            
            scene_right.camera.position.copy(scene_left.camera.position);
            scene_right.camera.quaternion.copy(scene_left.camera.quaternion);
            scene_right.camera.zoom = scene_left.camera.zoom;
    
            scene_right.camera.updateProjectionMatrix();
            scene_right.camera.updateMatrixWorld();
            scene_right.renderer.depth = 0;
            scene_right.renderer.render(scene_right.scene, scene_right.camera);
        }
        render_loop();
    }
}

export { PerspectiveCameraTest }
