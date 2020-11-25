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
  constructor(scene, camera, _renderer, options = {}) {
    console.assert(scene instanceof THREE.Scene, "scene is not instance of THREE.Scene.");
    console.assert(camera instanceof THREE.Camera, "camera is not instance of THREE.Camera");
    console.assert(_renderer instanceof THREE.WebGLRenderer, "renderer is not an instance of THREE.WebGLRenderer");

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

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(resolution_width, resolution_height);
    renderer.setRenderTarget(buffer_texture);

    let dims = new THREE.Vector2();
    _renderer.getDrawingBufferSize(dims);

    let uniforms = {
      "time": { value: 1.0 },
      "dim_x": { value: dims.x },
      "dim_y": { value: dims.y },
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
    this._renderer = _renderer;


    // XXX TODO.
    this.transform = this.transform;

    this.antialias = antialias;
    this.resolution_width = resolution_width;
    this.resolution_height = resolution_height;

    this.buffer_texture = buffer_texture;

    // @super member variables
    this.map = this.buffer_texture.texture;

    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  onWindowResize() {
    let dims = new THREE.Vector2();
    this._renderer.getDrawingBufferSize(dims);

    this.uniforms["dim_x"].value = dims.x;
    this.uniforms["dim_y"].value = dims.y;
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
    var initial = this._renderer.getRenderTarget();
    this._renderer.setRenderTarget(this.buffer_texture);
    var dims = new THREE.Vector2();
    //this._renderer.getDrawingBufferSize(dims);

    //this._renderer.setSize(this.resolution_width, this.resolution_height);

    this._renderer.render(this.scene, this.camera);
    this.buffer_texture.texture.needsUpdate = false;

    this._renderer.setRenderTarget(initial);
    //this._renderer.setSize(dims);
  }
}

export { PortalMaterial };