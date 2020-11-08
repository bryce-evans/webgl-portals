import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

Controls = function( camera, domElement) {

    this.controls = OrbitControls(camera, domElement);
    this.update = function() {
        this.controls.update();
    }

  ////// Listeners

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

  }

  window.addEventListener( 'resize', onWindowResize, false );

  var show_miniscenes = false;

  $(document).keydown(function (event) {
    if (event.which == 32) {
      $('#miniscenes').show();
      show_miniscenes = true;
    }
  });

  $(document).keyup(function (event) {
    if (event.which == 32) {
      $('#miniscenes').hide();
      show_miniscenes = false;
    }
  });


}