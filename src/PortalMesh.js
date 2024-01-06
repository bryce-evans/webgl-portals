import {Mesh} from '..//modules/three.js/src/objects/Mesh.js';
import {PortalMaterial} from './PortalMaterial.js';


class PortalMesh extends Mesh {
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

    console.assert(geometry instanceof THREE.Geometry, 'geometry is not an instance of THREE.Geometry');
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

    // assume true: if (this.isPlanar()) {
    let geo_vec = this.geometry.faces[0].normal;
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
    const tri = this.geometry.faces[0];
    const verts = this.geometry.vertices;
    const pts = [verts[tri.a], verts[tri.b], verts[tri.c]];
    const a = new THREE.Vector3(pts[0].x, pts[0].y, pts[0].z);
    const b = new THREE.Vector3(pts[1].x, pts[1].y, pts[1].z);
    const c = new THREE.Vector3(pts[2].x, pts[2].y, pts[2].z);
    const ab = b.sub(a);
    const ac = c.sub(a);
    const cross = ab.cross(ac).normalize();
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

    if (this.show_debug_uvs) {
      const ctx = this.debug_canvas2d.getContext('2d');
      ctx.clearRect(0, 0, this.debug_canvas2d.width, this.debug_canvas2d.height);
      this.debug_renderer.render(this.material.scene, this.camera);
    }

    // Compute UVs for where the mesh is on the screen.
    const face_uvs = this.geometry.faceVertexUvs[0];
    const face_idx = this.geometry.faces;
    const vertices = this.geometry.vertices;

    for (let i = 0; i < face_uvs.length; i++) {
      // Tri Processing:
      const tri_uvs = face_uvs[i];
      const tri_vertices = face_idx[i];
      const tri_geometry = [vertices[tri_vertices['a']], vertices[tri_vertices['b']], vertices[tri_vertices['c']]];

      const uvs = [];
      for (let j = 0; j < tri_uvs.length; j++) {
        // Vertex Processing:
        // Project to camera.
        const vertex = tri_geometry[j];
        const projected = vertex.clone().project(this.camera);
        projected.x = (projected.x + 1) / 2;
        projected.y = -(projected.y - 1) / 2;

        // Push point to debug viz.
        if (this.show_debug_uvs) {
          uvs.push({x: projected.x * this.debug_width, y: projected.y * this.debug_height});
        }

        // Set the UVs.
        const uv = tri_uvs[j];
        uv.x = projected.x;
        uv.y = 1 - projected.y;
      }

      // Draw debug viz.
      if (this.show_debug_uvs) {
        this._drawTriangle(this.debug_canvas2d, uvs[0], uvs[1], uvs[2]);
      }
    }
    this.geometry.uvsNeedUpdate = true;
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
    console.assert(container !== undefined, "No container provided for renderDebugUVs");
    console.assert(show !== undefined && typeof(show) == 'boolean',
        'showDebugUVs takes boolean input.',
    );
    this.show_debug_uvs = show;

    if (!this.debug_dom_el) {
      if (!this.debug_height || !this.debug_width) {
        console.error('Debugging window dimensions not set. Include debug_{height, width} in constructor options.');
      }

      const div = $('<div class="debug_container">');
      div.append(this.debug_renderer.domElement);

      const canvas = $(`<canvas height=${this.debug_height} width=${this.debug_width}></canvas>`);
      canvas.addClass('overlay');
      canvas.addClass('debug-portal-window');
      this.debug_canvas2d = canvas[0];

      div.append(canvas);
      container.append(div);
    }
  }
}

export {PortalMesh};
