class PortalMaterial extends THREE.MeshBasicMaterial {
  constructor(scene, renderer, camera, options = {}) {
    /** Represents an animated material derived from rendering an offscreen scene.
     *  
     * Params:
     * 
     * scene: THREE.Scene
     *      Scene to render inside the window.
     * renderer: THREE.Renderer
     *      Renderer to use for rendering the scene.
     * 
     * Options:
     *
     * transform: THREE.Euler
     *      Rotation of the scene so it appears in the correct orientation for target portal geometry
     *
     * antialias: boolean (default=true)
     *      Renders with anti-aliasing if true
     * 
     * resolution_width: int
     * resolution_height: int
     *      Height and width resolution of the render. Should usually be the same as the main window.
     */

    super(options);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    // XXX TODO.
    this.transform = options.transform || null;

    this.antialias = options.antialias || false;
    this.resolution_width = options.resolution_width || window.innerWidth;
    this.resolution_height = options.resolution_height || window.innerHeight;

    this.buffer_texture = new THREE.WebGLRenderTarget(this.resolution_width, this.resolution_height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });
    //this.live_material = new THREE.MeshBasicMaterial({ map: this.buffer_texture.texture });

    // Required by parent to render.
    this.map = this.buffer_texture.texture;
  }

  getScene() {
    return this.scene;
  }

  getBufferImage() {
    return this.buffer_image;
  }

  setCamera(cam) {
    this.camera = cam;
  }

  onBeforeRender() {
    this.camera.updateProjectionMatrix();
    this.renderer.setRenderTarget(this.buffer_texture);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(null);
  }

}

export { PortalMaterial };