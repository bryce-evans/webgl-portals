import * as THREE from 'three';
import {PortalMaterial} from './PortalMaterial.js';

class PortalMesh extends THREE.Mesh {
  constructor(geometry, portal_material, options = {}) {
    /** Renders as the scene associated with input portal_material.
         * Gives the appearance of the mesh acting as a portal.
         *
         * Params:
         * ----------
         * geometry: THREE.Geometry
         *      Geometry that scene render gets projected to
         * portal_material: PortalMaterial
         *      Portal material to be rendered to this Mesh.
         *
         * Options:
         * -----------
         * show_wire_geometry: boolean (default=false)
         *      Shows a wireframe alongside the mesh to show the geometry of the portal area.
         * debug_width: int
         * debug_height: int
         *      Height and width of debug info to be rendered to.
         */

    console.assert(geometry instanceof THREE.BufferGeometry, 'geometry is not an instance of THREE.Geometry');
    console.assert(portal_material instanceof PortalMaterial, 'portal_material is not an instance of PortalMaterial');

    super(geometry, portal_material);

    // call showDebugUVs() to enable.
    this.show_debug_uvs = false;

    // TODO: Allow debug rendering to be configurable.
    this.debug_width = options.debug_width || this.resolution_width / 4;
    this.debug_height = options.debug_height || this.resolution_height / 4;

    this.debug_renderer = new THREE.WebGLRenderer({antialias: true});
    this.debug_renderer.setSize(this.debug_width, this.debug_height);

    this.camera = this.material.camera;

    // A wireframe showing the geometry.
    this.wire = null;

    // TODO: compute this properly.
    this.is_planar = false;
  }

  wireGeometry() {
    const wireframe = new THREE.WireframeGeometry(this.geometry);
    const line = new THREE.LineSegments(wireframe);
    line.material.depthTest = true;
    // line.material.opacity = 0.5;
    line.material.color = new THREE.Color(0x0088ff);
    // line.material.transparent = true;
    return line;
  }

  update() {
    this.material.update();
  }

  isPortal() {
    return true;
  }

  getScene() {
    return this.portal_material.getScene();
  }

  getScreenGeometry() {
    return this.screen_geometry;
  }

  getBufferImage() {
    return this.portal_material.getBufferImage();
  }

  linkTwin(twin_p_mesh) {
    this.twin = twin_p_mesh;
  }

  /**
     * Returns true if any face is visible. Used for optimization.
     */
  isVisible(camera) {
    let cam_vec = new THREE.Vector3();
    camera.getWorldDirection(cam_vec);

    // Get the normal of the first face from BufferGeometry
    const normalAttr = this.geometry.getAttribute('normal');
    if (!normalAttr) {
      return true; // If no normals, assume visible
    }

    let geo_vec = new THREE.Vector3(
      normalAttr.getX(0),
      normalAttr.getY(0),
      normalAttr.getZ(0)
    );

    return cam_vec.dot(geo_vec) < 0;
  }

  /**
     * True if the geometry is coplanar.
     * This technically only checks the normals so translations of the same plane are valid.
     * Allows for optimizations in rendering.
     */
  isPlanar() {
    // TODO: Allow this to be computed instead of manually set.
    return this.is_planar;
  }

  getClippingPlane() {
    if (!this.isPlanar) {
      console.warn('Generating single clipping plane for non-planar geometry.');
    }

    // Get first triangle from BufferGeometry
    const positionAttr = this.geometry.getAttribute('position');
    const indexAttr = this.geometry.index;

    // Get the three vertex indices of the first triangle
    const i0 = indexAttr ? indexAttr.getX(0) : 0;
    const i1 = indexAttr ? indexAttr.getX(1) : 1;
    const i2 = indexAttr ? indexAttr.getX(2) : 2;

    // Get the three vertices
    const a = new THREE.Vector3(
      positionAttr.getX(i0),
      positionAttr.getY(i0),
      positionAttr.getZ(i0)
    );
    const b = new THREE.Vector3(
      positionAttr.getX(i1),
      positionAttr.getY(i1),
      positionAttr.getZ(i1)
    );
    const c = new THREE.Vector3(
      positionAttr.getX(i2),
      positionAttr.getY(i2),
      positionAttr.getZ(i2)
    );

    // Calculate plane from three points
    const ab = new THREE.Vector3().subVectors(b, a);
    const ac = new THREE.Vector3().subVectors(c, a);
    const cross = new THREE.Vector3().crossVectors(ab, ac).normalize();

    return new THREE.Plane(cross, -(a.x * cross.x + a.y * cross.y + a.z * cross.z));
  }

  /**
     * Render the internal portal scene to this Mesh.
     * This function is called implicitly by THREE.js.
     * Input args are for the full scene,
     *  **not** the args to the portal scene we are renderering.
     *
     * @param {THREE.WebGLRenderer} renderer
     *    The renderer of the full scene (not the internal portal scene).
     * @param {THREE.Scene} scene
     *    The full scene being rendered that this is part of.
     * @param {THREE.Camera} camera
     *    Main camera of the scene.
     * @param {THREE.Geometry} geometry
     *    The geometry of the portal mesh.
     * @param {THREE.Material} material
     *    The material of the rendered object (this).
     * @param {THREE.Group} group
     *    The group this portal belongs to (if any).
     */
  onBeforeRender(renderer, scene, camera, geometry, material, group) {
    // TODO: disabled temporarily.
    // if (window._FREEZE_ALL_PORTALS) {
    //   if (this.material instanceof PortalMaterial) {
    //     this.material.uniforms["frozen"].value = true;
    //   }
    //   return;
    // }
    // if (this.material instanceof PortalMaterial) {
    //   this.material.uniforms["frozen"].value = false;
    // }

    this.update();

    // Render the internal scene of the portal to this mesh's texture.
    this.material.onBeforeRender(renderer, scene, camera, geometry, material, group);

    // XXX FIXME This is broken. Causing infinite recursion.
    // if (this.show_debug_uvs) {
    //   const ctx = this.debug_canvas2d.getContext('2d');
    //   ctx.clearRect(0, 0, this.debug_canvas2d.width, this.debug_canvas2d.height);
    //   this.debug_renderer.render(this.material.scene, this.camera);
    // }

    // Compute UVs for where the mesh is on the screen.
    const face_uvs = this.geometry.getAttribute('uv');
    const positionAttr = this.geometry.getAttribute('position');
    const indexAttr = this.geometry.index;

    // Get number of triangles
    const triangleCount = indexAttr ? indexAttr.count / 3 : positionAttr.count / 3;

    // Process each triangle:
    for (let i = 0; i < triangleCount; i++) {
      const uvs = [];

      // Process each vertex of the triangle:
      for (let j = 0; j < 3; j++) {
        const vertexIndex = i * 3 + j;
        const posIndex = indexAttr ? indexAttr.getX(vertexIndex) : vertexIndex;

        // Get vertex position in local space
        const vertex = new THREE.Vector3(
          positionAttr.getX(posIndex),
          positionAttr.getY(posIndex),
          positionAttr.getZ(posIndex)
        );

        // Transform to world space, then project to camera
        vertex.applyMatrix4(this.matrixWorld);
        const projected = vertex.project(this.camera);
        projected.x = (projected.x + 1) / 2;
        projected.y = -(projected.y - 1) / 2;

        // Push point to debug viz.
        if (this.show_debug_uvs) {
          uvs.push({x: projected.x * this.debug_width, y: projected.y * this.debug_height});
        }

        // Set the UVs.
        face_uvs.setXY(vertexIndex, projected.x, projected.y);
      }

      // Draw debug viz.
      if (this.show_debug_uvs) {
        this._drawTriangle(this.debug_canvas2d, uvs[0], uvs[1], uvs[2]);
      }
    }

    face_uvs.needsUpdate = true;
  }

  /**
     * Draws a 2D triangle on a canvas.
     * Used in debugging portal UVs.
     */
  _drawTriangle(canvas, a, b, c) {
    if (!canvas.getContext) {
      console.error('cannot get context for ', canvas);
      return;
    }

    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#FF0000';
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.lineTo(a.x, a.y);
    ctx.stroke();
  }

  renderDebugUVs(show=true, container=undefined) {
    
    console.assert(show !== undefined && typeof(show) == 'boolean',
        'showDebugUVs takes boolean input.',
    );

    if (container === undefined) {
      console.warn("No container provided for renderDebugUVs. Appending to default 'debug_container'");
      container = document.body;
    }
    this.show_debug_uvs = show;

    if (!this.debug_dom_el) {
      if (!this.debug_height || !this.debug_width) {
        console.error('Debugging window dimensions not set. Include debug_{height, width} in constructor options.');
      }

    // Create container.
    const div = document.createElement('div');
    div.classList.add('debug_container');
    div.appendChild(this.debug_renderer.domElement);

    // Create a canvas element with the specified height and width.
    const canvas = document.createElement('canvas');
    canvas.setAttribute('height', this.debug_height);
    canvas.setAttribute('width', this.debug_width);
    canvas.classList.add('overlay', 'debug-portal-window');
    this.debug_canvas2d = canvas;

    div.appendChild(canvas);
    container.appendChild(div);
    }
  }
}

export {PortalMesh};
