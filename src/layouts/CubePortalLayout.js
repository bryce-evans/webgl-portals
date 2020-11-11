import {PortalWindowLayout} from './PortalWindowLayout.js'

class CubePortalLayout extends PortalWindowLayout {
    constructor(args) {
        super(args);

        // Forward render result to output texture.
        var mainBoxGeo = new THREE.BoxGeometry(this.size, this.size, this.size);
        var mainBoxObject = new THREE.Mesh(mainBoxGeo, live_materials);
        scene.add(mainBoxObject);

        show_layout_geometry = false
        if (show_layout_geometry) {
            var wireframe = new THREE.WireframeGeometry(mainBoxGeo);
            var line = new THREE.LineSegments(wireframe);
            line.material.depthTest = true;
            line.material.opacity = 0.5;
            line.material.color = new THREE.Color(0x0088ff)
            line.material.transparent = true;
            scene.add(line);
        }

        // TODO load frame
        layout.showFrame();
    }

    showFrame() {
        loader.load('rsc/models/frame.glb', function (gltf) {
            gltf.scene.scale.set(1.1, 1.1, 1.1);
            this.scene.add(gltf.scene);

            var light = new THREE.PointLight(0xffffff, 1);
            light.position.set(0, 3, 15);
            this.scene.add(light);

        }, undefined, function (error) {
            console.error(error);
        });
    }
}

export {CubePortalLayout};