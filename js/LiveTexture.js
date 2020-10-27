import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';


function main() {

  var renderer = new THREE.WebGLRenderer({ antialias: true });
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  var scene = new THREE.Scene();

  // var camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
  camera.position.y = 30;
  camera.position.z = 50;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var gridXZ = new THREE.GridHelper(100, 10, new THREE.Color(0xff0000), new THREE.Color(0xffffff));
  scene.add(gridXZ);

  var bufferScene = new THREE.Scene();
  var bufferScene2 = new THREE.Scene();

  var width = 512;
  var height = 512;
  var controls = new OrbitControls(camera, renderer.domElement);

  //////

  var light_color = 0xffffff;
  var light_intensity = 1;

  var buffer_textures = []
  var buffer_scenes = []
  var lights = []
  var dummy_materials = []
  var dummy_objs = []
  var dummy_bg_materials = []
  var dummy_bgs = []
  var live_materials = []
  for (var i = 0; i < 6; i++) {
    var buffer_texture = new THREE.WebGLRenderTarget(width, height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });
    buffer_textures.push(buffer_texture)

    var buffer_scene = new THREE.Scene();
    buffer_scenes.push(buffer_scene)

    var light = new THREE.DirectionalLight(light_color, light_intensity);
    light.position.set(5, 5, 15);
    light.target.position.set(0, 0, 0);
    buffer_scene.add(light);
    buffer_scene.add(light.target);
  
    var hue = Math.random() * 360
    var dummy_material = new THREE.MeshPhongMaterial({ color: new THREE.Color("hsl("+hue+", 100%, 50%)") });
    var dummy_geometry = new THREE.BoxGeometry(6, 6, 6);
    var dummy_obj = new THREE.Mesh(dummy_geometry, dummy_material);
    dummy_obj.position.z = -10;
    buffer_scene.add(dummy_obj);
    dummy_objs.push(dummy_obj)
  
    var hue = Math.random() * 360
    var dummy_bg_mat = new THREE.MeshBasicMaterial({ color: new THREE.Color("hsl("+hue+", 100%, 50%)") })
    dummy_bg_materials.push(dummy_bg_mat)
    var plane = new THREE.PlaneBufferGeometry(width, height);
    var dummy_bg = new THREE.Mesh(plane, dummy_bg_mat);
    dummy_bgs.push(dummy_bg)
    dummy_bg.position.z = -15;
    buffer_scene.add(dummy_bg);

    var live_material = new THREE.MeshBasicMaterial({ map: buffer_texture.texture });
    live_materials.push(live_material)
  }

  // Forward render result to output texture.
  var mainBoxGeo = new THREE.BoxGeometry(10, 10, 10);
  var mainBoxObject = new THREE.Mesh(mainBoxGeo, live_materials);
  mainBoxObject.position.z = 0;
  scene.add(mainBoxObject);

  function render() {

    controls.update();
    requestAnimationFrame(render);

    //Make the box rotate on box axises
    // boxObject.rotation.y += 0.01;
    // boxObject.rotation.x += 0.02;
    // boxObject2.rotation.y += 0.03;
    // boxObject2.rotation.x += 0.01;
    //Rotate the main box too
    // mainBoxObject.rotation.y -= 0.01;
    // mainBoxObject.rotation.x -= 0.01;

    for (var i = 0; i < 6; i++){
      renderer.setRenderTarget(buffer_textures[i])
    renderer.render(buffer_scenes[i], camera);
    }

    renderer.setRenderTarget(null)
    renderer.render(scene, camera);

  }
  render();
}

main();