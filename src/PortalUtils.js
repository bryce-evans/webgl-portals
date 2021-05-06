/**
 * A set of geometry utilies.
 */

import { PortalMesh } from "./PortalMesh.js";
import { PortalMaterial } from "./PortalMaterial.js";

class PortalUtils {
    static genId() {
        Math.random().toString(36).substring(7);
    }

    /** Takes a geometry and splits the tris into n_groups. 
     *  Useful for splitting core geometry into faces.
     *  Example: splitGeometryToGroups(new THREE.CubeGeometry(), 6) => [face1, face2, ...]
     */
    static splitGeometryToGroups(geometry, n_groups) {
        var groups = [];
        var n_faces = geometry.faces.length;
        if (n_faces % n_groups !== 0) {
            console.error("Geometry is not splitable into " + n_groups + " groups.");
        }

        var group_size = n_faces / n_groups;

        for (var i = 0; i < n_faces; i += group_size) {
            // Create a new geometry for each group, with map for old vertex indices to new.
            var g = new THREE.Geometry();
            var vertex_map = {};
            for (var j = 0; j < group_size; j++) {
                // Move the faces in the group to the new geometry.
                var f = geometry.faces[i + j];
                var new_vert_idx = [];

                [f.a, f.b, f.c].forEach(function(vert_idx, k) {
                    if (!(vert_idx in vertex_map)) {
                        g.vertices.push(geometry.vertices[vert_idx]);
                        vertex_map[vert_idx] = g.vertices.length - 1;
                    }
                    new_vert_idx.push(vertex_map[vert_idx]);
                });

                f.a = new_vert_idx[0];
                f.b = new_vert_idx[1];
                f.c = new_vert_idx[2];

                g.faces.push(f);
                g.faceVertexUvs[0].push(geometry.faceVertexUvs[0][i + j]);
            }

            g.parameters = geometry.parameters;
            groups.push(g);
        }
        return groups;
    }

    /** Merges a list of geometries into a single Geometry object.
     */
    static mergeGeometries(geometries) {
        console.warn("Not implemented.");
        debugger;
        return geometries[0];
    }

    /**
     * Adds a bidirectional portal to each scene. 
     * scene1 can be equivalent to scene2 (for a portal from one position in the scene to another).
     * @param {THREE.Geometry} p_geo: geometry to use for the portal. Should be planar.
     * @param {THREE.Scene} scene1
     * @param {THREE.Vector3} pos1: Position in the scene to place the geometry 
     * @param {THREE.Scene} scene2 
     * @param {THREE.Vector3} pos2: Position in the scene to place the geometry 
     * @param {THREE.Camera} camera 
     */
    static AddBiDiPortal(p_geo, scene1, pos1, scene2, pos2, camera, renderer) {
        var clip1 = new THREE.Plane(new THREE.Vector3(0, -1, 0));
        var p_mat1 = new PortalMaterial(scene2, camera, renderer, { clipping_plane: clip1 });
        var p_mesh1 = new PortalMesh(p_geo, p_mat1);
        p_mesh1.is_planar = true;
        p_mesh1.position.set(pos1);

        var clip2 = new THREE.Plane(new THREE.Vector3(0, -1, 0));
        var p_mat2 = new PortalMaterial(scene1, camera, renderer, { clipping_plane: clip2 });
        var p_mesh2 = new PortalMesh(p_geo, p_mat2);
        p_mesh2.is_planar = true;
        p_mesh2.position.set(pos2);

        p_mesh1.linkTwin(p_mesh2);
        p_mesh2.linkTwin(p_mesh1);

        scene1.add(p_mesh1);
        scene2.add(p_mesh2);

        return [p_mesh1, p_mesh2];
    }

    /**
     * Links an object between two scenes, adding it to both relative to the portals so crossing between them is seemless.
     */
    static LinkMeshBetweenScenes(mesh, incoming_scene, incoming_portal, outgoing_scene, outgoing_portal) {

    }
}

export { PortalUtils }