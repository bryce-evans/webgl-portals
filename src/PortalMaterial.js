import * as THREE from 'three';

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
class PortalMaterial extends THREE.MeshBasicMaterial {
  constructor(scene, camera, renderer, options = {}) {
    console.assert(scene instanceof THREE.Scene, 'scene is not instance of THREE.Scene.');
    console.assert(camera instanceof THREE.Camera, 'camera is not instance of THREE.Camera');
    console.assert(renderer instanceof THREE.WebGLRenderer, 'renderer is not an instance of THREE.WebGLRenderer');

    const name = options.name || '';

    super();
    // TODO: load shaders from file.
    // var loader = new THREE.FileLoader();
    // loader.load('shaders/portal.frag',function ( data ) {fShader =  data;},);
    // loader.load('shaders/portal.vertex',function ( data ) {vShader =  data;},);
    const clock = new THREE.Clock();

    const antialias = options.antialias || false;
    const resolution_width = options.resolution_width || 1024;
    const resolution_height = options.resolution_height || 1024;

    const buffer_texture = new THREE.WebGLRenderTarget(resolution_width, resolution_height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      colorSpace: THREE.SRGBColorSpace
    });
    buffer_texture.name = name;
    buffer_texture.texture.image.name = name;
    buffer_texture.texture.colorSpace = THREE.SRGBColorSpace;

    const alpha_buffer_texture = new THREE.WebGLRenderTarget(resolution_width, resolution_height, {minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});
    alpha_buffer_texture.name = name;
    alpha_buffer_texture.texture.image.name = name;

    const dims = new THREE.Vector2();
    renderer.getDrawingBufferSize(dims);
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.alpha = true;

    this.name = name;
    this.clock = clock;

    // this.depth = 1;
    // this.max_depth = options.max_depth || 1;

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
    // this.alphaMap = alpha_buffer_texture.texture
    this.clippingPlanes = options.clipping_plane ? [options.clipping_plane] : [];
    this.clipShadows = options.clip_shadows | false;

    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  onWindowResize() {
    const dims = new THREE.Vector2();
    this.renderer.getDrawingBufferSize(dims);
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
  }

  /**
   * @override
   * Removes affine correction (already applied when rendering internal portal scene).
   */
  onBeforeCompile(shader, renderer) {
    const dims = new THREE.Vector2();
    renderer.getDrawingBufferSize(dims);
    renderer.setPixelRatio(window.devicePixelRatio);

    // TODO: Input dimensions as uniforms for screen resizing.
    shader.fragmentShader =
      shader.fragmentShader.replace(
        '#include <map_fragment>',
        `vec4 texelColor = texture2D( map, gl_FragCoord.xy / vec2(${dims.x}, ${dims.y}) ); \
        diffuseColor *= texelColor;`,
      );
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
    // Check if freeze mode is enabled - skip rendering inner scene
    if (window._FREEZE_ALL_PORTALS) {
      return;
    }

    if (renderer.depth >= renderer.max_depth) {
      return;
    }

    renderer.depth += 1;

    console.assert(this.scene !== undefined, "No scene for portal material onBeforeRender");

    const initial = this.renderer.getRenderTarget();
    this.renderer.setRenderTarget(this.buffer_texture);

    renderer.render(this.scene, this.camera);

    this.buffer_texture.texture.needsUpdate = false;

    renderer.setRenderTarget(initial);

    renderer.depth -= 1;
  }
}

export {PortalMaterial};
