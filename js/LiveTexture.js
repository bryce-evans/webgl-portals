import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';


function main() {

  var renderer = new THREE.WebGLRenderer( {antialias:true} );
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize (width, height);
  document.body.appendChild (renderer.domElement);

  var scene = new THREE.Scene();
  
  var cubeGeometry = new THREE.BoxGeometry (10,10,10);
  var cubeMaterial = new THREE.MeshBasicMaterial ({color: 0x1ec876});
  var cube = new THREE.Mesh (cubeGeometry, cubeMaterial);

  cube.position.set (0, 0, 0);
  scene.add (cube);

  var camera = new THREE.PerspectiveCamera (45, width/height, 1, 10000);
  camera.position.y = 160;
  camera.position.z = 400;
  camera.lookAt (new THREE.Vector3(0,0,0));

  var controls = new OrbitControls (camera, renderer.domElement);
  
  var gridXZ = new THREE.GridHelper(100, 10, new THREE.Color(0xff0000), new THREE.Color(0xffffff));
  scene.add(gridXZ);

  var bufferScene = new THREE.Scene();

  var width = 512;
  var height = 512;
  var buffer_camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
  var main_camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);


  var bufferTexture = new THREE.WebGLRenderTarget(width, height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter });

  var redMaterial = new THREE.MeshBasicMaterial({ color: 0xF06565 });
  var boxGeometry = new THREE.BoxGeometry(5, 5, 5);
  var boxObject = new THREE.Mesh(boxGeometry, redMaterial);
  boxObject.position.z = -10;
  bufferScene.add(boxObject);

  var blueMaterial = new THREE.MeshBasicMaterial({ color: 0x7074FF })
  var plane = new THREE.PlaneBufferGeometry(width, height);
  var planeObject = new THREE.Mesh(plane, blueMaterial);
  planeObject.position.z = -15;
  bufferScene.add(planeObject);


  // Forward render result to output texture.
  var live_material = new THREE.MeshBasicMaterial({ map: bufferTexture.texture });
  var basic_material = new THREE.MeshBasicMaterial({ color: 'green' });
  var boxGeometry2 = new THREE.BoxGeometry(5, 5, 5);
  var mainBoxObject = new THREE.Mesh(boxGeometry2, live_material);
  mainBoxObject.position.z = -10;
  scene.add(mainBoxObject);


//   var controls = new OrbitControls(main_camera, renderer.domElement);

  function render() {

    controls.update();
    requestAnimationFrame(render);    

    //Make the box rotate on box axises
    boxObject.rotation.y += 0.01;
    boxObject.rotation.x += 0.01;
    //Rotate the main box too
    mainBoxObject.rotation.y -= 0.01;
    mainBoxObject.rotation.x -= 0.01;

    renderer.setRenderTarget(bufferTexture)
    renderer.render(bufferScene, buffer_camera);

    renderer.setRenderTarget(null)
    renderer.render (scene, camera);

  }
  render();
}

main();