class Utils {

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

        for (var i = 0; i <= n_faces; i += group_size) {

            // Create a new geometry for each group, with map for old vertex indices to new.
            var g = new THREE.Geometry();
            var vertex_map = {};
            for (var j = 0; i < group_size; i++) {
                // Move the faces in the group to the new geometry.
                var f = geometry.faces[i + j];
                var new_vert_idx = [];

                [f.a, f.b, f.c].forEach(function (vert_idx, k) {
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
        debugger;
        return geometries[0];
    }


}

export { Utils }