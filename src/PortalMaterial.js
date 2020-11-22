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
class PortalMaterial extends THREE.ShaderMaterial {
  constructor(scene, camera, renderer, options = {}) {
    console.assert(scene instanceof THREE.Scene, "scene is not instance of THREE.Scene.");
    console.assert(camera instanceof THREE.Camera, "camera is not instance of THREE.Camera");
    console.assert(renderer instanceof THREE.WebGLRenderer, "renderer is not an instance of THREE.WebGLRenderer");

    let name = options.name || "";

    // TODO: load shaders from file.
    // var loader = new THREE.FileLoader();
    // loader.load('shaders/portal.frag',function ( data ) {fShader =  data;},);
    // loader.load('shaders/portal.vertex',function ( data ) {vShader =  data;},);
    let clock = new THREE.Clock();

    let antialias = options.antialias || false;
    let resolution_width = options.resolution_width || 1024;
    let resolution_height = options.resolution_height || 1024;

    let buffer_texture = new THREE.WebGLRenderTarget(resolution_width, resolution_height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });
    buffer_texture.name = name;
    buffer_texture.texture.image.name = name;

    let uniforms = {
      "time": { value: 1.0 },
      "windowWidth": { value: resolution_width },
      "windowHeight": { value: resolution_height },
      "internalSceneTexture": { value: buffer_texture.texture },
    };

    super({
      uniforms: uniforms,
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent,
      name: name,
    });

    this.name = name;
    this.clock = clock;
    this.uniforms = uniforms;

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    // XXX TODO.
    this.transform = this.transform;

    this.antialias = antialias;
    this.resolution_width = resolution_width;
    this.resolution_height = resolution_height;

    this.buffer_texture = buffer_texture;

    // @super member variables
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

  update() {
    const delta = this.clock.getDelta();
    this.uniforms["time"].value += delta * 5;
  }

  /**
   * Render the internal portal scene to this material's buffer texture map.
   * Signature follows the same as THREE's onBeforeRender, which is implicitly 
   * invoked in PortalMesh. PortalMesh calls onBeforeRender to its material here.
   * It should be noted that the args input are the args of the full scene,
   *  **not** the args of the internal portal scene we are renderering.
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
    // The same renderer may be used for other targets,
    // so make sure set it back after rendering our scene.
    var initial = this.renderer.getRenderTarget();
    this.renderer.setRenderTarget(this.buffer_texture);
    this.renderer.setSize(this.width, this.height);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(initial);
    this.buffer_texture.texture.needsUpdate = false;

    /// Get from original
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

export { PortalMaterial };