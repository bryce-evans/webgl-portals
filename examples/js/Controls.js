/**
 * Improved controls over the standard THREE.OrbitControls.
 * Adds listeners to show debug info on keypress.
 */


import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

class Controls {
  constructor(camera, renderer) {
    this.orbit_controls = new OrbitControls(camera, renderer.domElement);

    this.renderer = renderer;
    this.camera = camera;
    this.show_debug_uvs = false;
  }

  update() {
    this.orbit_controls.update();
  }
  addListeners() {
    function onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize.bind(this), false);

    $(document).keydown(function (event) {
      if (event.which == 32) {
        $('#debug_uvs').show();
        this.show_debug_uvs = true;
      }
    }.bind(this));

    $(document).keyup(function (event) {
      if (event.which == 32) {
        $('#debug_uvs').hide();
        this.show_debug_uvs = false;
      }
    }.bind(this));
  }
}

export { Controls };