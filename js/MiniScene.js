MiniScene = function (renderer, scene, screen_geometry, transform, size) {
  /** Represents a scene on a face.
   *  
   * Params:
   * renderer: THREE.Renderer
   *      Renderer object used to render the scene
   * scene: THREE.Scene
   *      Scene object to render
   * screen_geometry: THREE.Geometry
   *      Geometry that scene render gets projected to 
   * transform: THREE.Euler
   *      Rotation of the scene so it appears in the correct orientation for target screen geometry
   */

  this.scene = scene;
  this.screen_geometry = screen_geometry;
  this.buffer_image;
  this.renderer = renderer;

  // This is required to be set with .setCamera()
  this.camera = null;

  var renderers = []
  var canvas2ds = []
  var buffer_textures = []
  var buffer_scenes = []
  var dummy_geos = [new THREE.BoxGeometry(size, size, size), new THREE.ConeGeometry(size, size, 6), new THREE.DodecahedronGeometry(size / 2), new THREE.IcosahedronBufferGeometry(size / 2), new THREE.TetrahedronBufferGeometry(size / 2), new THREE.TorusGeometry(size / 2, size / 4, 10, 10)];
  var dummy_objs = [];
  var dummy_bg_materials = []
  var dummy_bgs = []
  var live_materials = []

  this.getScene = function () {
    return this.scene;
  }

  this.getScreenGeometry = function () {
    return this.screen_geometry;
  }

  this.getBufferImage = function () {
    return this.buffer_image;
  }


  this.isVisible = function () {

  }

  this.setCamera = function(cam) {
    this.camera = cam;
  }

  this.addCanvasToDebugDom = function(dom_elem) {
    var div = $('<div>');
    div.append(miniscene_renderer.domElement);
    var canvas2d = $(`<canvas height=${height / 4} width=${width / 4} class="overlay"></canvas>`);
    div.append(canvas2d)
    canvas2ds.push(canvas2d[0]);
    dom_elem.append(div);
  }

  this.init = function (debug_dom=null, render_width, render_height) {
    // Initialization of the scene

    var miniscene_renderer = new THREE.WebGLRenderer({ antialias: true });

    // XXX: Not sure if downscaling by 4 is good. Another arg to set this needed?
    miniscene_renderer.setSize(render_width / 4 , render_height / 4);
    renderers.push(miniscene_renderer);

    if (debug_dom != null) {
      this.addCanvasToDebugDom(debug_dom);
    }
    
    var buffer_texture = new THREE.WebGLRenderTarget(render_width, render_height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });
    buffer_textures.push(buffer_texture)

    var buffer_scene = new THREE.Scene();
    buffer_scenes.push(buffer_scene)

    var light = new THREE.PointLight(light_color, light_intensity);
    light.position.set(0, 3, 15);
    buffer_scene.add(light);

    buffer_scene.add(new THREE.AmbientLight(0xfff));

    var hue = Math.random() * 360
    var dummy_material = new THREE.MeshPhongMaterial({ color: new THREE.Color("hsl(" + hue + ", 100%, 50%)") });
    var dummy_geometry = dummy_geos[i]
    var dummy_obj = new THREE.Mesh(dummy_geometry, dummy_material);
    dummy_obj.position.z = -1;
    buffer_scene.add(dummy_obj);
    dummy_objs.push(dummy_obj);


    var room = new THREE.BoxGeometry(10, 10, 10);
    var hue = Math.random() * 360
    var dummy_bg_mat = new THREE.MeshPhongMaterial({ color: new THREE.Color("hsl(" + hue + ", 100%, 50%)") })
    dummy_bg_mat.side = THREE.BackSide
    dummy_bg_materials.push(dummy_bg_mat)
    var dummy_bg = new THREE.Mesh(room, dummy_bg_mat);
    dummy_bgs.push(dummy_bg)
    buffer_scene.add(dummy_bg);

    var live_material = new THREE.MeshBasicMaterial({ map: buffer_texture.texture });
    live_materials.push(live_material)
  }

  // Clear first scene for cornell box
  var cur_scene = buffer_scenes[4];
  cur_scene.remove.apply(cur_scene, cur_scene.children);
  const loader = new GLTFLoader();

  loader.load('rsc/models/cornell-box.glb', function (gltf) {
    cur_scene.add(gltf.scene);
  }, undefined, function (error) {
    console.error(error);
  });


  // Set Scenes to correct orientation

  //        .----------------.
  //      / |               /
  //     /  |              / |                  Y  Z
  //    /   |     2       /  |  << 5 (back)     | /
  //   /    |            /   |                  |/
  //  .----------------.     |                   ----- X
  //  |  1             |  0  |
  //  |    /           |    /
  //  |   /    4       |   /
  //  |  /             |  /
  //  | /              | /   << 3 (under)
  //  . -------------- .
  //

  buffer_scenes[0].setRotationFromEuler(new THREE.Euler(0, Math.PI / 2, 0))
  buffer_scenes[1].setRotationFromEuler(new THREE.Euler(0, - Math.PI / 2, 0))
  buffer_scenes[2].setRotationFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0))
  buffer_scenes[3].setRotationFromEuler(new THREE.Euler(Math.PI / 2, 0, 0))
  buffer_scenes[4].setRotationFromEuler(new THREE.Euler(0, 0, 0))
  buffer_scenes[5].setRotationFromEuler(new THREE.Euler(Math.PI, 0, 0))



  this.render = function () {

  }


  this.drawTriangle = function (canvas, a, b, c) {
    if (!canvas.getContext) {
      console.error("cannot get context for ", canvas);
      return;
    }

    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.lineTo(a.x, a.y);
    ctx.stroke();
  }


  this.renderTextureUVs = function () {
    return false;
  }
}
