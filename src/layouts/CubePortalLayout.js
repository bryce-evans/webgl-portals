import { PortalLayout } from './PortalLayout.js'
import { PortalUtils } from '/src/PortalUtils.js'

var MAX_SCENES = 6;

class CubePortalLayout extends PortalLayout {
    constructor(scenes, camera, renderer, options) {
        super(options);

        console.assert(scenes.length === MAX_SCENES, "Incorrect number of scenes. Expected " + MAX_SCENES);

        var cubeGeo = new THREE.BoxGeometry(this.size, this.size, this.size);
        this.geometries = PortalUtils.splitGeometryToGroups(cubeGeo, MAX_SCENES);
        this.init(this.geometries, scenes, camera, renderer);
    }

    static maxScenes() {
        return MAX_SCENES;
    }
}

export { CubePortalLayout };