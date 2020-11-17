/**
 * Improved controls over the standard THREE.OrbitControls.
 * Adds listeners to show debug info on keypress.
 */


import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

class Controls {
  constructor(camera, domElement) {
    this.orbit_controls = new OrbitControls(camera, domElement);

    this.show_debug_uvs = false;
  }

  update() {
    this.orbit_controls.update();
  }
  addListeners() {
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    }
    window.addEventListener('resize', onWindowResize, false);

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