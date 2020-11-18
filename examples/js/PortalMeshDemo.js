import { Controls } from '/examples/js/Controls.js';
import { PortalMaterial } from '/src/PortalMaterial.js';
import { PortalMesh } from '/src/PortalMesh.js';


var MainScene = function () {

  this.init = function () {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0x222222, 1);

    var width = 1024;
    var height = 1024;
    this.renderer.setSize(width, height);
    document.body.appendChild(this.renderer.domElement);

    var scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xfff));

    var camera = new THREE.OrthographicCamera(width / -80, width / 80, height / 80, height / -80, 1, 1000);
    camera.position.set(11, 11, 11);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.controls = new Controls(camera, this.renderer);
    this.controls.addListeners();

    var miniscene = new THREE.Scene();
    var dummy_geo = new THREE.DodecahedronGeometry(3);
    var dummy_mat = new THREE.MeshPhongMaterial({ color: new THREE.Color("hsl(220, 100%, 50%)") });
    var dummy_mesh = new THREE.Mesh(dummy_geo, dummy_mat);
    miniscene.add(dummy_mesh)

    var light_color = 0xffffff;
    var light_intensity = 1;
    var light = new THREE.PointLight(light_color, light_intensity);
    light.position.set(0, 3, 15);
    miniscene.add(light);

    this.miniscene = miniscene;

    var portal_geo = new THREE.PlaneGeometry(10, 10, 1);
    var portal_mat = new PortalMaterial(miniscene, camera, this.renderer);
    
    this.buffer_texture = portal_mat.buffer_texture; 

    var portal = new PortalMesh(portal_geo, portal_mat, { "debug_width": 256, "debug_height": 256 });
    //portal.renderDebugUVs(true);
    scene.add(portal);

    // var test = new THREE.Mesh(new THREE.CubeGeometry(3, 3, 3));
    // scene.add(test);

    this.camera = camera;
    this.scene = scene;
    this.portal = portal;
    this.portal_mat = portal_mat;
  }

  this.animate = function () {
    var renderer = this.renderer;
    var scene = this.scene;
    var camera = this.camera;
    var portal = this.portal;
    var miniscene = this.miniscene;
    var buffer_texture = this.buffer_texture;
    var controls = this.controls;

    function render_loop() {
      controls.update();
      requestAnimationFrame(render_loop);

      camera.updateProjectionMatrix();
      var face_uvs = portal.geometry.faceVertexUvs[0];
      var face_idx = portal.geometry.faces;
      var vertices = portal.geometry.vertices;
  
      for (var i = 0; i < face_uvs.length; i++) {
        // per tri
        var tri_uvs = face_uvs[i];
        var tri_vertices = face_idx[i];
        var tri_geometry = [vertices[tri_vertices['a']], vertices[tri_vertices['b']], vertices[tri_vertices['c']]]
  
        for (var j = 0; j < tri_uvs.length; j++) {
          // per vertex
  
          // project to camera
          var vertex = tri_geometry[j];
          var projected = vertex.clone().project(camera);
          projected.x = (projected.x + 1) / 2;
          projected.y = -(projected.y - 1) / 2;
  
          // Set the UVs.
          var uv = tri_uvs[j];
          uv.x = projected.x;
          uv.y = 1 - projected.y;
        }
      }
      portal.geometry.uvsNeedUpdate = true;
  
      // Render Textures.
      renderer.setRenderTarget(buffer_texture);
      renderer.render(miniscene, camera);

      renderer.setRenderTarget(null);
      renderer.render(scene, camera);

      // requestAnimationFrame(render_loop);
      // renderer.render(scene, camera);
    }
    render_loop();
  }
}

var scene = new MainScene();
scene.init();
scene.animate();