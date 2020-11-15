import { PortalWindowLayout } from './PortalLayout.js'
import { Utils } from './Utils.js'

class CubePortalLayout extends PortalWindowLayout {
    constructor(args) {
        super(args);

        var cubeGeo = new THREE.BoxGeometry(this.size, this.size, this.size);


        Utils.splitGeometryToGroups(cubeGeo)

        var mainBoxObject = new THREE.Mesh(cubeGeo, live_materials);

        scene.add(mainBoxObject);
    }
}

export { CubePortalLayout };