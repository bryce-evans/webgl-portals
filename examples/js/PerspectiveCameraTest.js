import * as THREE from "three";
import { CubePortalLayout } from "../../examples/js/layouts/CubePortalLayout.js";
import { RandomGeometryScene } from "./utils/RandomGeometryScene.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class CubeScene {
  constructor(target, scenes, has_perspective_corrected) {
    target = target || document.body;
    let width = target.offsetWidth / 2;
    let height = window.innerHeight - 128; // Subtract 128px for debug bar

    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff, 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.domElement.style.display = "inline-block";
    renderer.domElement.style.verticalAlign = "top"; // Prevent inline-block spacing issues
    target.appendChild(renderer.domElement);
    this.renderer = renderer;

    let scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff));
    this.scene = scene;

    let camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(17, 10, 17);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.camera = camera;
  }
}

class IncorrectCubeScene extends CubeScene {
  constructor(target, scenes, has_perspective_corrected, testInstance) {
    super(target, scenes, has_perspective_corrected);
    this.testInstance = testInstance;

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
          colorSpace: THREE.SRGBColorSpace,
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
      basicMat.update = function () {
        // No-op: MeshBasicMaterial doesn't need updates
      };

      // Override onBeforeRender to render the portal scene to buffer texture
      // This recreates the portal rendering without perspective correction
      const sceneInstance = this;
      basicMat.onBeforeRender = function (renderer) {
        // Skip if freeze mode is enabled (F key)
        if (
          sceneInstance.testInstance &&
          sceneInstance.testInstance.freezeMode
        ) {
          return;
        }

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
    const positionAttr = geometry.getAttribute("position");
    const uvAttr = geometry.getAttribute("uv");

    if (!positionAttr || !uvAttr) {
      console.warn("Portal geometry missing position or UV attribute");
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
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(newUVs, 2));
    geometry.attributes.uv.needsUpdate = true;
  }

  renderCustomDebugUVs(portals, container) {
    console.log(`Creating debug views for ${portals.length} portals`);

    // Calculate size to fit all 6 portals across the screen width
    // Cap height at 128px
    const maxHeight = 128;
    const availableWidth = window.innerWidth;
    const debugWidth = Math.floor(availableWidth / portals.length);
    const debugHeight = Math.min(debugWidth, maxHeight); // Cap at 128px
    const debugSize = debugHeight; // Use height as the size (square)

    console.log(`Debug canvas size: ${debugSize}x${debugSize}`);

    // Create a single shared renderer for all debug views to avoid too many WebGL contexts
    const sharedDebugCanvas = document.createElement("canvas");
    sharedDebugCanvas.width = debugSize;
    sharedDebugCanvas.height = debugSize;
    const sharedDebugRenderer = new THREE.WebGLRenderer({
      canvas: sharedDebugCanvas,
      antialias: true,
    });
    sharedDebugRenderer.setSize(debugSize, debugSize);
    sharedDebugRenderer.setClearColor(0x000000, 1);

    portals.forEach((portal, index) => {
      const mat = portal.material;
      if (!mat.bufferTexture) {
        console.warn(`Portal ${index} has no bufferTexture`);
        return;
      }

      // Create a 2D canvas for displaying the rendered scene + UV overlay
      const canvas = document.createElement("canvas");
      canvas.width = debugSize;
      canvas.height = debugSize;
      canvas.style.width = `${debugSize}px`;
      canvas.style.height = `${debugSize}px`;
      canvas.style.display = "block";
      canvas.style.backgroundColor = "#000";

      container.appendChild(canvas);

      // Store references
      mat.debugCanvas = canvas;

      console.log(`Created debug view for portal ${index}`);
    });

    // Store the shared renderer
    this.sharedDebugRenderer = sharedDebugRenderer;
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
    this.freezeMode = false; // F key toggles freeze mode (stops rendering and UV updates)
    window._FREEZE_ALL_PORTALS = false; // Initialize global freeze flag

    let scenes = [];
    for (let i = 0; i < CubePortalLayout.maxScenes(); i++) {
      scenes.push(new RandomGeometryScene({ size: 5 }));
    }

    this.scene_left = new IncorrectCubeScene(
      document.body,
      scenes,
      false,
      this
    );
    this.scene_right = new CorrectedCubeScene(document.body, scenes, true);

    this.controls = new OrbitControls(this.scene_left.camera, document.body);

    // Add keyboard listeners for freeze functionality
    document.addEventListener("keydown", (e) => {
      if (e.key === "f" || e.key === "F") {
        // Set freeze flag BEFORE toggling mode to prevent one more frame from updating
        const newFreezeMode = !this.freezeMode;
        window._FREEZE_ALL_PORTALS = newFreezeMode;
        this.freezeMode = newFreezeMode;

        console.log("=".repeat(60));
        console.log("Freeze Mode:", this.freezeMode ? "ON (textures and UVs frozen)" : "OFF");
        console.log("window._FREEZE_ALL_PORTALS =", window._FREEZE_ALL_PORTALS);
        console.log("=".repeat(60));

        // Update the info div to show freeze status
        const infoDiv = document.getElementById('info');
        if (infoDiv) {
          const freezeStatus = this.freezeMode ? '<span style="color: red; font-weight: bold;">FREEZE MODE ACTIVE</span>' : '';
          infoDiv.innerHTML = `Perspective Camera Test<br>Press &lt;space&gt; to toggle debug view, F to freeze UVs, G to freeze textures<br>${freezeStatus}`;
        }
      }
    });
  }

  render() {
    let scene_left = this.scene_left;
    let scene_right = this.scene_right;
    let controls = this.controls;
    let self = this;

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
            // Skip camera and UV updates if freeze mode is enabled
            if (!self.freezeMode) {
              mat.portalCamera.position.copy(scene_left.camera.position);
              mat.portalCamera.quaternion.copy(scene_left.camera.quaternion);
              mat.portalCamera.updateMatrixWorld();
              scene_left.updatePortalUVs(portal, mat.portalCamera);
            }
          }
        });
      }

      scene_left.renderer.depth = 0;
      scene_right.renderer.depth = 0;

      scene_left.renderer.render(scene_left.scene, scene_left.camera);
      scene_right.renderer.render(scene_right.scene, scene_right.camera);

      // Update debug views if they exist
      if (scene_left.portal_cube && scene_left.sharedDebugRenderer) {
        const debugDiv = document.getElementById("debug_uvs");
        const debugVisible = debugDiv && debugDiv.style.display !== "none";

        if (debugVisible) {
          scene_left.portal_cube.portals.forEach((portal, index) => {
            const mat = portal.material;
            if (mat.debugCanvas) {
              try {
                // Render the portal scene using the shared renderer
                scene_left.sharedDebugRenderer.render(
                  mat.portalScene,
                  mat.portalCamera
                );

                // Copy the rendered result to this portal's debug canvas
                const canvas = mat.debugCanvas;
                const ctx = canvas.getContext("2d");
                const debugWidth = canvas.width;
                const debugHeight = canvas.height;

                // Clear and draw the WebGL rendered scene
                ctx.clearRect(0, 0, debugWidth, debugHeight);
                ctx.drawImage(scene_left.sharedDebugRenderer.domElement, 0, 0);

                // Project cube face vertices into camera/image space to show UV mapping
                const geometry = portal.geometry;
                const positionAttr = geometry.getAttribute("position");
                const indexAttr = geometry.index;

                if (positionAttr && indexAttr) {
                  ctx.strokeStyle = "#FF0000";
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
                      const u = vertex.x * 0.5 + 0.5;
                      const v = vertex.y * 0.5 + 0.5;

                      projectedUVs.push({
                        x: u * debugWidth,
                        y: (1 - v) * debugHeight, // Flip Y for canvas coordinates
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
                console.error(
                  `Error rendering debug view for portal ${index}:`,
                  e
                );
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
