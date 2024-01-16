import * as THREE from 'three';

class PortalRenderer extends THREE.WebGLRenderer {
  constructor(options = {}) {
    super(options);
    this.max_depth = options.max_depth || 1;
  }

  render(scene, camera, depth) {
    depth = depth || 1;

    if (depth > this.max_depth) {
      return;
    }

    super.render(scene, camera);

  }
}

export {PortalRenderer};
