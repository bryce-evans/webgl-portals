import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';


function main() {

  var renderer = new THREE.WebGLRenderer({ antialias: true });
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  var scene = new THREE.Scene();

  // var camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  var camera = new THREE.OrthographicCamera(width / -20, width / 20, height / 20, height / -20, 1, 1000);
  camera.position.y = 15;
  camera.position.z = 15;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var gridXZ = new THREE.GridHelper(100, 10, new THREE.Color(0x880000), new THREE.Color(0x333333));
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
    var dummy_material = new THREE.MeshPhongMaterial({ color: new THREE.Color("hsl(" + hue + ", 100%, 50%)") });
    var dummy_geometry = new THREE.BoxGeometry(6, 6, 6);
    var dummy_obj = new THREE.Mesh(dummy_geometry, dummy_material);
    dummy_obj.position.z = -1;
    buffer_scene.add(dummy_obj);
    dummy_objs.push(dummy_obj)

    var hue = Math.random() * 360
    var dummy_bg_mat = new THREE.MeshPhongMaterial({ color: new THREE.Color("hsl(" + hue + ", 100%, 50%)") })
    dummy_bg_mat.side = THREE.BackSide
    dummy_bg_materials.push(dummy_bg_mat)

    var plane = new THREE.BoxGeometry(10, 10, 10);
    var dummy_bg = new THREE.Mesh(plane, dummy_bg_mat);
    dummy_bgs.push(dummy_bg)
    buffer_scene.add(dummy_bg);

    var live_material = new THREE.MeshBasicMaterial({ map: buffer_texture.texture });
    live_materials.push(live_material)
  }

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



  // Forward render result to output texture.
  var mainBoxGeo = new THREE.BoxGeometry(10, 10, 10);
  var mainBoxObject = new THREE.Mesh(mainBoxGeo, live_materials);
  scene.add(mainBoxObject);


  var wireframe = new THREE.WireframeGeometry(mainBoxGeo);

  var line = new THREE.LineSegments(wireframe);
  line.material.depthTest = true;
  line.material.opacity = 0.5;
  line.material.color = new THREE.Color(0x0088ff)
  line.material.transparent = true;

  scene.add(line);


  function toScreenXY(pos, canvas) {
    var width = canvas.width, height = canvas.height;

    var p = new THREE.Vector3(pos.x, pos.y, pos.z);
    var vector = p.project(camera);

    vector.x = (vector.x + 1) / 2 * width;
    vector.y = -(vector.y - 1) / 2 * height;

    return vector;
  }


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

    camera.updateProjectionMatrix();
    var face_uvs = mainBoxObject.geometry.faceVertexUvs[0];
    var face_idx = mainBoxObject.geometry.faces;
    var vertices = mainBoxObject.geometry.vertices;

    // per tri
    for (var i = 0; i < face_uvs.length; i++) {
      var tri_uvs = face_uvs[i];
      var tri_vertices = face_idx[i];
      var tri_geometry = [vertices[tri_vertices['a']], vertices[tri_vertices['b']], vertices[tri_vertices['c']]]

      // per vertex
      for (var j = 0; j < tri_uvs.length; j++) {

        // project to camera
        var vertex = tri_geometry[j];
        var projected = vertex.project(camera);

        var uv = tri_uvs[j];
        uv.x = projected.x;
        uv.y = projected.y;
      }
    }
    mainBoxObject.geometry.uvsNeedUpdate = true;




    for (var i = 0; i < 6; i++) {
      renderer.setRenderTarget(buffer_textures[i])
      renderer.render(buffer_scenes[i], camera);
    }




    renderer.setRenderTarget(null)
    renderer.render(scene, camera);

  }
  render();
}

main();