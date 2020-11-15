class PortalLayout extends THREE.Group {
    constructor(args) {
        super();
        this.portals = [];
        this.size = args.size || 1;

        // Allow initialization with showing wire
        this.show_wire_geometry = args.show_wire_geometry || false;
        this.showWireGeometry(this.show_wire_geometry);
    }

    portals() {
        return this.portals;
    }

    foreach_portal(fn) {
        for (var i = 0; this.portals.length; i++) {
            var p = this.portals[i];
            fn(p);
        }
    }

    showWireGeometry(show) {
        this.show_wire_geometry = show;
        this.foreach_portal(function(p){p.showWireGeometry(show);});
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
        this.foreach_portal(function(p) {return planar && p.isPlanar()});
        return planar;
    }

    /**
     * Returns window IDs that are visible in the main camera.
     * Requires all windows be planar.
     */
    visibleScenes() {
        console.error("TODO: implement visibleScenes");
    }

    /** Callback used by THREE.
     * Render the windows in the group here.
     */
    onBeforeRender() {
        console.log("onBeforeRenderCalled!");
        // Render code here...

 
    }
}

export { PortalLayout };