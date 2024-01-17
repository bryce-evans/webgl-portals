import * as THREE from 'three';

class PortalRenderer extends THREE.WebGLRenderer {
  constructor(options = {}) {
    super(options);
    // this.super_render = super.render();
    // this.super_render = super.render.bind(this);
    this.depth = 1;
    this.max_depth = options.max_depth || 1;
  };

  render(scene, camera) {
    console.info("Called correct render!");
    // super.render(scene, camera);
    // window.plane.reset();
  };

};

export {PortalRenderer};
