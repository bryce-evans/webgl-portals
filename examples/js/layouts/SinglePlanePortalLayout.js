import {PortalLayout} from './PortalWindowLayout.js';

class SinglePlanePortalLayout {
  constructor(camera, renderer, size = 1) {
    this.windows = [];
    this.camera = camera;
    this.renderer = renderer;
    this.size = size;
  }

  isFullyPlanar() {
    return true;
  }

  n_windows() {
    return 1;
  }

  showFrameGeometry() {
    console.error('not implemented.');
  }

  setCamera() {
    this.camera = camera;
  }

  setRenderer() {
    this.renderer = renderer;
  }

  setWindowToScene(window_id, scene) {
    if (window_id > this.n_windows) {
      console.error('window_id not valid');
    }
    this.windows[window_id].scene = scene;
  }

  renderDebugTextureUVs(domElement) {
    console.error('not implemented');
  }


  /**
     * Returns window IDs that are visible in the main camera.
     * Requires all windows be planar.
     */
  visibleScenes() {
    console.error('TODO: implement visibleScenes');
  }

  /** Callback used by THREE.
     * Render the windows in the group here.
     */
  onBeforeRender() {
    console.log('onBeforeRenderCalled!');
    // Render code here...

    camera.updateProjectionMatrix();
    const face_uvs = mainBoxObject.geometry.faceVertexUvs[0];
    const face_idx = mainBoxObject.geometry.faces;
    const vertices = mainBoxObject.geometry.vertices;


    for (const idx in canvas2ds) {
      var canvas = canvas2ds[idx];
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    for (var i = 0; i < face_uvs.length; i++) {
      // per tri
      const tri_uvs = face_uvs[i];
      const tri_vertices = face_idx[i];
      const tri_geometry = [vertices[tri_vertices['a']], vertices[tri_vertices['b']], vertices[tri_vertices['c']]];


      var canvas = canvas2ds[Math.floor(i / 2)];
      const context = canvas.getContext('2d');


      const uvs = [];
      for (let j = 0; j < tri_uvs.length; j++) {
        // per vertex

        // project to camera
        const vertex = tri_geometry[j];
        const projected = vertex.clone().project(miniscene_camera);
        projected.x = (projected.x + 1) / 2;
        projected.y = -(projected.y - 1) / 2;


        // For drawing UVs in debugger tools.
        uvs.push({x: projected.x * width / 4, y: projected.y * height / 4});


        // Set the UVs.
        const uv = tri_uvs[j];
        uv.x = projected.x;
        uv.y = 1 - projected.y;
      }
      drawTriangle(canvas, uvs[0], uvs[1], uvs[2]);
    }
    mainBoxObject.geometry.uvsNeedUpdate = true;


    for (var i = 0; i < 6; i++) {
      renderer.setRenderTarget(buffer_textures[i]);
      renderer.render(buffer_scenes[i], miniscene_camera);
    }

    renderer.setRenderTarget(null);
  }
}
