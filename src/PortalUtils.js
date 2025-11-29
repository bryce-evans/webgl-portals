/**
 * A set of geometry utilies.
 */
import * as THREE from 'three';
import {PortalMesh} from './PortalMesh.js';
import {PortalMaterial} from './PortalMaterial.js';

class PortalUtils {
  static genId() {
    Math.random().toString(36).substring(7);
  }

  /** Takes a geometry and splits the tris into n_groups.
     *  Useful for splitting core geometry into faces.
     *  Example: splitGeometryToGroups(new THREE.BoxGeometry(), 6) => [face1, face2, ...]
     */
  static splitGeometryToGroups(geometry, n_groups) {
    const groups = [];

    // Get geometry attributes
    const positionAttr = geometry.getAttribute('position');
    const normalAttr = geometry.getAttribute('normal');
    const uvAttr = geometry.getAttribute('uv');
    const indexAttr = geometry.index;

    // Calculate number of triangles
    const n_faces = indexAttr ? indexAttr.count / 3 : positionAttr.count / 3;

    if (n_faces % n_groups !== 0) {
      console.error('Geometry is not splitable into ' + n_groups + ' groups.');
    }

    const group_size = n_faces / n_groups;

    for (let i = 0; i < n_groups; i++) {
      const startFace = i * group_size;
      const endFace = (i + 1) * group_size;

      // Collect unique vertices for this group
      const vertexMap = new Map();
      const newPositions = [];
      const newNormals = [];
      const newUVs = [];
      const newIndices = [];

      for (let faceIdx = startFace; faceIdx < endFace; faceIdx++) {
        const baseIdx = faceIdx * 3;

        for (let v = 0; v < 3; v++) {
          const vertIdx = indexAttr ? indexAttr.getX(baseIdx + v) : baseIdx + v;

          if (!vertexMap.has(vertIdx)) {
            const newIdx = vertexMap.size;
            vertexMap.set(vertIdx, newIdx);

            // Copy vertex data
            newPositions.push(
              positionAttr.getX(vertIdx),
              positionAttr.getY(vertIdx),
              positionAttr.getZ(vertIdx)
            );

            if (normalAttr) {
              newNormals.push(
                normalAttr.getX(vertIdx),
                normalAttr.getY(vertIdx),
                normalAttr.getZ(vertIdx)
              );
            }

            if (uvAttr) {
              newUVs.push(
                uvAttr.getX(vertIdx),
                uvAttr.getY(vertIdx)
              );
            }
          }

          newIndices.push(vertexMap.get(vertIdx));
        }
      }

      // Create new BufferGeometry for this group
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));

      if (newNormals.length > 0) {
        g.setAttribute('normal', new THREE.Float32BufferAttribute(newNormals, 3));
      } else {
        // Compute vertex normals if source geometry didn't have them
        g.computeVertexNormals();
      }

      if (newUVs.length > 0) {
        g.setAttribute('uv', new THREE.Float32BufferAttribute(newUVs, 2));
      }

      g.setIndex(newIndices);
      g.parameters = geometry.parameters;

      groups.push(g);
    }

    return groups;
  }

  /** Merges a list of geometries into a single Geometry object.
     */
  static mergeGeometries(geometries) {
    console.warn('Not implemented.');
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
    const clip1 = new THREE.Plane(new THREE.Vector3(0, -1, 0));
    const p_mat1 = new PortalMaterial(scene2, camera, renderer, {clipping_plane: clip1});
    const p_mesh1 = new PortalMesh(p_geo, p_mat1);
    p_mesh1.is_planar = true;
    p_mesh1.position.set(pos1);

    const clip2 = new THREE.Plane(new THREE.Vector3(0, -1, 0));
    const p_mat2 = new PortalMaterial(scene1, camera, renderer, {clipping_plane: clip2});
    const p_mesh2 = new PortalMesh(p_geo, p_mat2);
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

export {PortalUtils};
