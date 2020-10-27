import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';


function main() {

  var renderer = new THREE.WebGLRenderer({ antialias: true });
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.y = 30;
  camera.position.z = 50;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var controls = new OrbitControls(camera, renderer.domElement);

  var gridXZ = new THREE.GridHelper(100, 10, new THREE.Color(0xff0000), new THREE.Color(0xffffff));
  scene.add(gridXZ);

  var bufferScene = new THREE.Scene();
  var bufferScene2 = new THREE.Scene();

  var width = 512;
  var height = 512;
  var buffer_camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
  var main_camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);

  var bufferTexture = new THREE.WebGLRenderTarget(width, height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });
  var bufferTexture2 = new THREE.WebGLRenderTarget(width, height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });


  /// SCENE 1
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(5, 5, 15);
  light.target.position.set(0, 0, 0);
  bufferScene.add(light);
  bufferScene.add(light.target);

  var redMaterial = new THREE.MeshPhongMaterial({ color: 0xF06565 });
  var boxGeometry = new THREE.BoxGeometry(5, 5, 5);
  var boxObject = new THREE.Mesh(boxGeometry, redMaterial);
  boxObject.position.z = -10;
  bufferScene.add(boxObject);

  var blueMaterial = new THREE.MeshBasicMaterial({ color: 0x7074FF })
  var plane = new THREE.PlaneBufferGeometry(width, height);
  var planeObject = new THREE.Mesh(plane, blueMaterial);
  planeObject.position.z = -15;
  bufferScene.add(planeObject);

  //////// SCENE 2


  const light2 = new THREE.DirectionalLight(color, intensity);
  light2.position.set(5, 5, 15);
  light2.target.position.set(0, 0, 0);
  bufferScene2.add(light2);
  bufferScene2.add(light2.target);

  var tealMaterial = new THREE.MeshPhongMaterial({ color: 0x0088aa });
  var boxGeometry = new THREE.BoxGeometry(6, 6, 6);
  var boxObject2 = new THREE.Mesh(boxGeometry, tealMaterial);
  boxObject2.position.z = -10;
  bufferScene2.add(boxObject2);

  var blueMaterial = new THREE.MeshBasicMaterial({ color: 0x7074FF })
  var plane = new THREE.PlaneBufferGeometry(width, height);
  var planeObject = new THREE.Mesh(plane, blueMaterial);
  planeObject.position.z = -15;
  bufferScene2.add(planeObject);

  //////


  // Forward render result to output texture.
  var live_material = new THREE.MeshBasicMaterial({ map: bufferTexture.texture });
  var live_material2 = new THREE.MeshBasicMaterial({ map: bufferTexture2.texture });
  var basic_material = new THREE.MeshBasicMaterial({ color: 'green' });
  var mainBoxGeo = new THREE.BoxGeometry(10, 10, 10);
  var mainBoxObject = new THREE.Mesh(mainBoxGeo, [live_material, live_material, live_material, live_material2, live_material2, live_material2]);
  mainBoxObject.position.z = 0;
  scene.add(mainBoxObject);

  function render() {

    controls.update();
    requestAnimationFrame(render);

    //Make the box rotate on box axises
    boxObject.rotation.y += 0.01;
    boxObject.rotation.x += 0.02;
    boxObject2.rotation.y += 0.03;
    boxObject2.rotation.x += 0.01;
    //Rotate the main box too
    mainBoxObject.rotation.y -= 0.01;
    mainBoxObject.rotation.x -= 0.01;

    renderer.setRenderTarget(bufferTexture)
    renderer.render(bufferScene, buffer_camera);

    renderer.setRenderTarget(bufferTexture2)
    renderer.render(bufferScene2, buffer_camera);

    renderer.setRenderTarget(null)
    renderer.render(scene, camera);

  }
  render();
}

main();