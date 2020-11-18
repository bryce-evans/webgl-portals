import { PortalMaterial } from "/src/PortalMaterial.js";
import { PortalMesh } from "/src/PortalMesh.js";

class PortalLayout extends THREE.Group {
    constructor(options = {}) {
        super(options);

        this.options = options;

        // Size of the mesh.
        this.size = options.size || 1;

        this.show_wire_geometry = options.show_wire_geometry || false;
    }

    init(geometries, scenes, camera, renderer) {

        this.scenes = scenes;
        this.camera = camera;
        this.renderer = renderer;

        this.portal_materials = [];
        this.portals = [];

        if (geometries instanceof Array) {
            if (geometries.length !== scenes.length) {
                console.error("Input geometries and scenes don't match.");
            }

            for (var i = 0; i < scenes.length; i++) {
                var portal_mat = new PortalMaterial(scenes[i], camera, renderer);
                var portal = new PortalMesh(geometries[i], portal_mat);
                this.portal_materials.push(portal_mat);
                this.portals.push(portal);
            }

        } else if (geometries instanceof THREE.Geometry) {
            for (var i = 0; i < scenes.length; i++) {
                var portal_mat = new PortalMaterial(scenes[i], renderer, camera);
                this.portal_materials.push(portal_mat);
            }
            var portal = new PortalMesh(geometries, this.portal_materials);
            this.portals.push(portal);
        } else {
            debugger;
            console.error("geometries is neither a THREE.Geometry or list of Geometries.");
        }

        for (var i = 0; i < this.portals.length; i++) {
            this.add(this.portals[i]);
        }

        // Allow initialization with showing wire
        this.showWireGeometry(this.show_wire_geometry);
    }

    getPortals() {
        return this.portals;
    }

    getScenes() {
        return this.fold_portals(function (e, acc) { acc.push(e.scene()); return acc; }, []);
    }

    static maxScenes() {
        console.error("maxScenes not implemented by child class.");
    }

    foldPortals(fn, acc) {
        for (var i = 0; i < this.portals.length; i++) {
            var p = this.portals[i];
            acc = fn(p, acc);
        }
        return acc;
    }

    foreachPortal(fn) {
        this.foldPortals(fn);
    }

    showWireGeometry(show) {
        this.show_wire_geometry = show;
        this.foreachPortal(function (p) { p.showWireGeometry(show); });
    }

    setScene(portal_id, scene) {
        if (portal_id > this.n_windows) {
            console.error("window_id not valid");
        }
        this.portals[portal_id].scene = scene;
    }

    /**
     * Returns true if all windows are planar geometry.
     * Allows for optimizations in rendering.
     */
    isFullyPlanar() {
        var planar = true;
        this.foreach_portal(function (p) { return planar && p.isPlanar() });
        return planar;
    }

    /**
     * Returns window IDs that are visible in the main camera.
     * Requires all windows be planar.
     */
    visibleScenes() {
        console.error("TODO: implement visibleScenes");
        return [];
    }

    /** Callback used by THREE.
     * Render the windows in the group here.
     */
    onBeforeRender() {
        for (var i = 0; i < this.portals.length; i++) {
            this.portals[i].onBeforeRender();
        }
    }
}

export { PortalLayout };