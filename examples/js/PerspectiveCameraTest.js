import * as THREE from "three";
import { CubePortalLayout } from "../../examples/js/layouts/CubePortalLayout.js";
import { RandomGeometryScene } from "./utils/RandomGeometryScene.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class CubeScene {
  constructor(target, scenes, has_perspective_corrected) {
    target = target || document.body;
    let width = target.offsetWidth / 2;
    let height = target.offsetHeight;

    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff, 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.domElement.style.display = "inline-block";
    target.appendChild(renderer.domElement);
    this.renderer = renderer;

    let scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff));
    this.scene = scene;

    let camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(11, 11, 11);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.camera = camera;
  }
}

class IncorrectCubeScene extends CubeScene {
  constructor(target, scenes, has_perspective_corrected) {
    super(target, scenes, has_perspective_corrected);

    const portal_render_resolution = 1048 * window.devicePixelRatio;
    let portal_cube = new CubePortalLayout(scenes, this.camera, this.renderer, {
      size: 10,
      resolution_width: portal_render_resolution,
      resolution_height: portal_render_resolution,
      debug_height: 256,
      debug_width: 256,
    });

    this.scene.add(portal_cube);
    this.scene.add(portal_cube.wireGeometry());
    this.portal_cube = portal_cube;

    // Replace PortalMaterial with basic MeshBasicMaterial for affine UV interpolation
    portal_cube.portals.forEach((portal, index) => {
      // Get the scene and camera from the portal materials array
      const portalScene = scenes[index];

      // Create a separate camera with aspect ratio 1.0 for square buffer texture
      const portalCamera = new THREE.PerspectiveCamera(
        this.camera.fov,
        1.0, // Square aspect ratio for square buffer texture
        this.camera.near,
        this.camera.far
      );
      // Copy position and rotation from main camera
      portalCamera.position.copy(this.camera.position);
      portalCamera.quaternion.copy(this.camera.quaternion);
      portalCamera.updateProjectionMatrix();

      // Create our own separate buffer texture for rendering
      const bufferTexture = new THREE.WebGLRenderTarget(
        portal_render_resolution,
        portal_render_resolution,
        {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.NearestFilter,
          format: THREE.RGBAFormat,
          type: THREE.UnsignedByteType,
          colorSpace: THREE.SRGBColorSpace
        }
      );
      bufferTexture.texture.colorSpace = THREE.SRGBColorSpace;

      // Create a simple MeshBasicMaterial that maps to our buffer texture
      const basicMat = new THREE.MeshBasicMaterial({
        map: bufferTexture.texture,
      });

      // Store references needed for rendering
      basicMat.portalScene = portalScene;
      basicMat.portalCamera = portalCamera;
      basicMat.bufferTexture = bufferTexture;

      // Recalculate UVs based on camera projection
      // This is necessary because we're rendering with a perspective camera
      // and need the UVs to match the projected vertex positions
      this.updatePortalUVs(portal, portalCamera);

      // Add empty update method (required by PortalMesh)
      basicMat.update = function() {
        // No-op: MeshBasicMaterial doesn't need updates
      };

      // Override onBeforeRender to render the portal scene to buffer texture
      // This recreates the portal rendering without perspective correction
      basicMat.onBeforeRender = function(renderer) {
        if (renderer.depth > (renderer.max_depth || 1)) {
          return;
        }
        renderer.depth = (renderer.depth || 0) + 1;

        const initial = renderer.getRenderTarget();
        renderer.setRenderTarget(basicMat.bufferTexture);

        // Render the portal scene to the buffer texture
        renderer.render(basicMat.portalScene, basicMat.portalCamera);

        basicMat.bufferTexture.texture.needsUpdate = false;
        renderer.setRenderTarget(initial);

        renderer.depth -= 1;
      };

      // Replace the material on the portal mesh and trigger shader recompilation
      portal.material = basicMat;
      basicMat.needsUpdate = true;
    });

    // Create custom debug display for buffer textures
    if (!has_perspective_corrected) {
      const debugContainer = $("#debug_uvs")[0];
      if (debugContainer) {
        this.renderCustomDebugUVs(portal_cube.portals, debugContainer);
      }
    }
  }

  updatePortalUVs(portal, portalCamera) {
    // Get the geometry and ensure world matrix is up to date
    const geometry = portal.geometry;
    portal.updateMatrixWorld(true);

    // Get position and UV attributes
    const positionAttr = geometry.getAttribute('position');
    const uvAttr = geometry.getAttribute('uv');

    if (!positionAttr || !uvAttr) {
      console.warn('Portal geometry missing position or UV attribute');
      return;
    }

    // Create array to store new UVs
    const newUVs = new Float32Array(uvAttr.count * 2);

    // For each vertex, project it through the camera and compute UV
    for (let i = 0; i < positionAttr.count; i++) {
      // Get vertex position in local space
      const vertex = new THREE.Vector3(
        positionAttr.getX(i),
        positionAttr.getY(i),
        positionAttr.getZ(i)
      );

      // Transform to world space
      vertex.applyMatrix4(portal.matrixWorld);

      // Project through the portal camera to get NDC coordinates
      vertex.project(portalCamera);

      // Convert from NDC (-1 to 1) to UV space (0 to 1)
      const u = vertex.x * 0.5 + 0.5;
      const v = vertex.y * 0.5 + 0.5;

      newUVs[i * 2] = u;
      newUVs[i * 2 + 1] = v;
    }

    // Update the UV attribute
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(newUVs, 2));
    geometry.attributes.uv.needsUpdate = true;
  }

  renderCustomDebugUVs(portals, container) {
    const debugSize = 256;

    console.log(`Creating debug views for ${portals.length} portals`);

    portals.forEach((portal, index) => {
      const mat = portal.material;
      if (!mat.bufferTexture) {
        console.warn(`Portal ${index} has no bufferTexture`);
        return;
      }

      // Create a container div for this portal
      const div = document.createElement('div');
      div.classList.add('debug_container');
      div.style.display = 'inline-block';
      div.style.position = 'relative';
      div.style.margin = '5px';

      // Create a canvas to display the buffer texture using 2D context
      const canvas = document.createElement('canvas');
      canvas.width = debugSize;
      canvas.height = debugSize;
      canvas.style.border = '2px solid #fff';
      canvas.style.backgroundColor = '#000';

      // Label
      const label = document.createElement('div');
      label.textContent = `Portal ${index}`;
      label.style.color = '#fff';
      label.style.fontSize = '12px';
      label.style.textAlign = 'center';

      div.appendChild(canvas);
      div.appendChild(label);
      container.appendChild(div);

      // Store the canvas for drawing the texture later
      mat.debugCanvas = canvas;

      console.log(`Created debug canvas for portal ${index}, buffer size: ${mat.bufferTexture.width}x${mat.bufferTexture.height}`);
    });
  }
}

class CorrectedCubeScene extends CubeScene {
  constructor(target, scenes, has_perspective_corrected) {
    super(target, scenes, has_perspective_corrected);

    const portal_render_resolution = 1048 * window.devicePixelRatio;
    let portal_cube = new CubePortalLayout(scenes, this.camera, this.renderer, {
      size: 10,
      resolution_width: portal_render_resolution,
      resolution_height: portal_render_resolution,
      debug_height: 256,
      debug_width: 256,
    });

    this.scene.add(portal_cube);
    this.scene.add(portal_cube.wireGeometry());
    this.portal_cube = portal_cube;
  }
}

class PerspectiveCameraTest {
  constructor() {
    let scenes = [];
    for (let i = 0; i < CubePortalLayout.maxScenes(); i++) {
      scenes.push(new RandomGeometryScene({ size: 5 }));
    }

    this.scene_left = new IncorrectCubeScene(document.body, scenes, false);
    this.scene_right = new CorrectedCubeScene(document.body, scenes, true);

    this.controls = new OrbitControls(this.scene_left.camera, document.body);
  }

  render() {
    let scene_left = this.scene_left;
    let scene_right = this.scene_right;
    let controls = this.controls;

    function render_loop() {
      controls.update();
      requestAnimationFrame(render_loop);

      scene_left.camera.updateMatrixWorld();

      scene_right.camera.position.copy(scene_left.camera.position);
      scene_right.camera.quaternion.copy(scene_left.camera.quaternion);
      scene_right.camera.zoom = scene_left.camera.zoom;
      scene_right.camera.updateProjectionMatrix();
      scene_right.camera.updateMatrixWorld();

      // Update portal cameras to match main camera position/rotation
      if (scene_left.portal_cube) {
        scene_left.portal_cube.portals.forEach((portal) => {
          const mat = portal.material;
          if (mat.portalCamera) {
            mat.portalCamera.position.copy(scene_left.camera.position);
            mat.portalCamera.quaternion.copy(scene_left.camera.quaternion);
            mat.portalCamera.updateMatrixWorld();

            // Update UVs based on new camera position
            scene_left.updatePortalUVs(portal, mat.portalCamera);
          }
        });
      }

      scene_left.renderer.depth = 0;
      scene_right.renderer.depth = 0;

      scene_left.renderer.render(scene_left.scene, scene_left.camera);
      scene_right.renderer.render(scene_right.scene, scene_right.camera);

      // Update debug views if they exist
      if (scene_left.portal_cube) {
        const debugVisible = document.getElementById('debug_uvs').style.display !== 'none';

        if (debugVisible) {
          scene_left.portal_cube.portals.forEach((portal, index) => {
            const mat = portal.material;
            if (mat.debugCanvas && mat.bufferTexture) {
              try {
                // Read pixels from the buffer texture and draw to canvas
                const canvas = mat.debugCanvas;
                const ctx = canvas.getContext('2d');
                const debugWidth = canvas.width;
                const debugHeight = canvas.height;

                // Get actual buffer texture dimensions
                const bufferWidth = mat.bufferTexture.width;
                const bufferHeight = mat.bufferTexture.height;

                // Create a temporary buffer to read pixels at full resolution
                const pixels = new Uint8Array(bufferWidth * bufferHeight * 4);

                // Read from the buffer texture
                const currentRenderTarget = scene_left.renderer.getRenderTarget();
                scene_left.renderer.setRenderTarget(mat.bufferTexture);
                scene_left.renderer.readRenderTargetPixels(
                  mat.bufferTexture,
                  0, 0,
                  bufferWidth, bufferHeight,
                  pixels
                );
                scene_left.renderer.setRenderTarget(currentRenderTarget);

                // Create a temporary canvas at full resolution
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = bufferWidth;
                tempCanvas.height = bufferHeight;
                const tempCtx = tempCanvas.getContext('2d');
                const imageData = tempCtx.createImageData(bufferWidth, bufferHeight);

                // Flip Y axis (WebGL has origin at bottom-left, canvas at top-left)
                for (let y = 0; y < bufferHeight; y++) {
                  for (let x = 0; x < bufferWidth; x++) {
                    const srcIdx = ((bufferHeight - 1 - y) * bufferWidth + x) * 4;
                    const dstIdx = (y * bufferWidth + x) * 4;
                    imageData.data[dstIdx] = pixels[srcIdx];
                    imageData.data[dstIdx + 1] = pixels[srcIdx + 1];
                    imageData.data[dstIdx + 2] = pixels[srcIdx + 2];
                    imageData.data[dstIdx + 3] = 255; // Force opaque
                  }
                }

                tempCtx.putImageData(imageData, 0, 0);

                // Scale down to debug canvas size
                ctx.clearRect(0, 0, debugWidth, debugHeight);
                ctx.drawImage(tempCanvas, 0, 0, bufferWidth, bufferHeight, 0, 0, debugWidth, debugHeight);

                // Project cube face vertices into camera/image space to show UV mapping
                const geometry = portal.geometry;
                const positionAttr = geometry.getAttribute('position');
                const indexAttr = geometry.index;

                if (positionAttr && indexAttr) {
                  ctx.strokeStyle = '#FF0000';
                  ctx.lineWidth = 2;

                  // Get the number of triangles
                  const triangleCount = indexAttr.count / 3;

                  // Get the portal camera used for rendering this face
                  const portalCamera = mat.portalCamera;
                  portal.updateMatrixWorld();

                  // Draw each triangle by projecting its vertices through the camera
                  for (let i = 0; i < triangleCount; i++) {
                    const projectedUVs = [];

                    // Get world positions for the 3 vertices of this triangle
                    for (let j = 0; j < 3; j++) {
                      const vertexIndex = i * 3 + j;
                      const posIndex = indexAttr.getX(vertexIndex);

                      // Get vertex position in local space
                      const vertex = new THREE.Vector3(
                        positionAttr.getX(posIndex),
                        positionAttr.getY(posIndex),
                        positionAttr.getZ(posIndex)
                      );

                      // Transform to world space
                      vertex.applyMatrix4(portal.matrixWorld);

                      // Project through the portal camera to get NDC coordinates
                      vertex.project(portalCamera);

                      // Convert from NDC (-1 to 1) to UV space (0 to 1)
                      // Then to canvas pixel coordinates
                      const u = (vertex.x * 0.5 + 0.5);
                      const v = (vertex.y * 0.5 + 0.5);

                      projectedUVs.push({
                        x: u * debugWidth,
                        y: (1 - v) * debugHeight // Flip Y for canvas coordinates
                      });
                    }

                    // Draw the triangle
                    ctx.beginPath();
                    ctx.moveTo(projectedUVs[0].x, projectedUVs[0].y);
                    ctx.lineTo(projectedUVs[1].x, projectedUVs[1].y);
                    ctx.lineTo(projectedUVs[2].x, projectedUVs[2].y);
                    ctx.lineTo(projectedUVs[0].x, projectedUVs[0].y);
                    ctx.stroke();
                  }
                }
              } catch (e) {
                console.error(`Error rendering debug view for portal ${index}:`, e);
              }
            }
          });
        }
      }
    }
    render_loop();
  }
}

export { PerspectiveCameraTest };
