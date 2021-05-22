import { Controls } from './utils/Controls.js';
import { CubePortalLayout } from '../../src/layouts/CubePortalLayout.js';
import { RandomGeometryScene } from './utils/RandomGeometryScene.js';


class PerspectiveCameraTest {
    constructor(target) {
        target = target || document.body;
        var width = target.offsetWidth;
        var height = target.offsetHeight;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor(0xffffff, 1);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        
        target.appendChild(this.renderer.domElement);

        var show_uv_debug = true;

        var scene = new THREE.Scene();
        scene.add(new THREE.AmbientLight(0xffffff));
        this.scene = scene;

        var camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
        //var camera = new THREE.OrthographicCamera(width / -80, width / 80, height / 80, height / -80, 1, 1000);

        camera.position.set(11, 11, 11);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.camera = camera;

        this.controls = new Controls(camera, this.renderer);
        this.controls.addListeners();

        var cube_scenes = [];
        for (var i = 0; i < CubePortalLayout.maxScenes(); i++) {
            cube_scenes.push(new RandomGeometryScene({ "size": 5 }));
        }

        const portal_render_resolution = 1048 * window.devicePixelRatio;
        var portal_cube = new CubePortalLayout(cube_scenes, camera, this.renderer, { size: 10, resolution_height: portal_render_resolution, resolution_height: portal_render_resolution, debug_height: 256, debug_width: 256 });
        scene.add(portal_cube);
        scene.add(portal_cube.wireGeometry());
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

        function render_loop() {
            controls.update();
            requestAnimationFrame(render_loop)

            portal.onBeforeRender();
            renderer.render(scene, camera);
        }
        render_loop();
    }
}

export { PerspectiveCameraTest }
