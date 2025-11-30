import * as THREE from "three";
import { CubePortalLayout } from "../../examples/js/layouts/CubePortalLayout.js";
import { RandomGeometryScene } from "./utils/RandomGeometryScene.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class CubeScene {
  constructor(target) {
    target = target || document.body;
    let width = target.offsetWidth / 2;
    let height = window.innerHeight - 128; // Subtract 128px for debug bar

    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff, 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.domElement.style.display = "inline-block";
    renderer.domElement.style.verticalAlign = "top";
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
  constructor(target, scenes) {
    super(target);

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
      const portalScene = scenes[index];

      // Create a separate camera with aspect ratio 1.0 for square buffer texture
      const portalCamera = new THREE.PerspectiveCamera(
        this.camera.fov,
        1.0, // Square aspect ratio for square buffer texture
        this.camera.near,
        this.camera.far
      );
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
      this.updatePortalUVs(portal, portalCamera);

      // Add empty update method (required by PortalMesh)
      basicMat.update = function () {};

      // Override onBeforeRender to render the portal scene to buffer texture
      basicMat.onBeforeRender = function (renderer) {
        if (window._FREEZE_ALL_PORTALS) {
          return;
        }

        if (renderer.depth > (renderer.max_depth || 1)) {
          return;
        }
        renderer.depth = (renderer.depth || 0) + 1;

        const initial = renderer.getRenderTarget();
        renderer.setRenderTarget(basicMat.bufferTexture);
        renderer.render(basicMat.portalScene, basicMat.portalCamera);
        basicMat.bufferTexture.texture.needsUpdate = false;
        renderer.setRenderTarget(initial);

        renderer.depth -= 1;
      };

      // Replace the material on the portal mesh
      portal.material = basicMat;
      basicMat.needsUpdate = true;
    });

    // Create custom debug display for buffer textures
    const debugContainer = $("#debug_uvs")[0];
    if (debugContainer) {
      this.renderCustomDebugUVs(portal_cube.portals, debugContainer);
    }
  }

  updatePortalUVs(portal, portalCamera) {
    if (window._FREEZE_ALL_PORTALS) {
      return;
    }

    const geometry = portal.geometry;
    portal.updateMatrixWorld(true);

    const positionAttr = geometry.getAttribute("position");
    const uvAttr = geometry.getAttribute("uv");

    if (!positionAttr || !uvAttr) {
      return;
    }

    const newUVs = new Float32Array(uvAttr.count * 2);

    for (let i = 0; i < positionAttr.count; i++) {
      const vertex = new THREE.Vector3(
        positionAttr.getX(i),
        positionAttr.getY(i),
        positionAttr.getZ(i)
      );

      vertex.applyMatrix4(portal.matrixWorld);
      vertex.project(portalCamera);

      const u = vertex.x * 0.5 + 0.5;
      const v = vertex.y * 0.5 + 0.5;

      newUVs[i * 2] = u;
      newUVs[i * 2 + 1] = v;
    }

    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(newUVs, 2));
    geometry.attributes.uv.needsUpdate = true;
  }

  renderCustomDebugUVs(portals, container) {
    const maxHeight = 128;
    const availableWidth = window.innerWidth;
    const debugWidth = Math.floor(availableWidth / portals.length);
    const debugSize = Math.min(debugWidth, maxHeight);

    // Create a single shared renderer for all debug views
    const sharedDebugCanvas = document.createElement("canvas");
    sharedDebugCanvas.width = debugSize;
    sharedDebugCanvas.height = debugSize;
    const sharedDebugRenderer = new THREE.WebGLRenderer({
      canvas: sharedDebugCanvas,
      antialias: true,
    });
    sharedDebugRenderer.setSize(debugSize, debugSize);
    sharedDebugRenderer.setClearColor(0x000000, 1);

    portals.forEach((portal) => {
      const mat = portal.material;
      if (!mat.bufferTexture) {
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = debugSize;
      canvas.height = debugSize;
      canvas.style.width = `${debugSize}px`;
      canvas.style.height = `${debugSize}px`;
      canvas.style.display = "block";
      canvas.style.backgroundColor = "#000";

      container.appendChild(canvas);
      mat.debugCanvas = canvas;
    });

    this.sharedDebugRenderer = sharedDebugRenderer;
  }
}

class CorrectedCubeScene extends CubeScene {
  constructor(target, scenes) {
    super(target);

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
    window._FREEZE_ALL_PORTALS = false;

    let scenes = [];
    for (let i = 0; i < CubePortalLayout.maxScenes(); i++) {
      scenes.push(new RandomGeometryScene({ size: 5 }));
    }

    this.scene_left = new IncorrectCubeScene(document.body, scenes);
    this.scene_right = new CorrectedCubeScene(document.body, scenes);

    this.controls = new OrbitControls(this.scene_left.camera, document.body);

    // Add keyboard listener for freeze functionality
    document.addEventListener("keydown", (e) => {
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
       
        // Lock in current UVs from the camera when frozen.
        this.scene_left.portal_cube.portals.forEach((portal) => {
          const mat = portal.material;
          if (mat.portalCamera) {
            this.scene_left.updatePortalUVs(portal, mat.portalCamera);
          }
        });

        window._FREEZE_ALL_PORTALS = !window._FREEZE_ALL_PORTALS;

        // Update the info div to show freeze status
        const infoDiv = document.getElementById("info");
        if (infoDiv) {
          const freezeStatus = window._FREEZE_ALL_PORTALS
            ? '<span style="color: red; font-weight: bold;">FREEZE MODE ACTIVE</span>'
            : "";
          infoDiv.innerHTML = `Perspective Camera Test<br>Press &lt;space&gt; to toggle debug view, F to freeze<br>${freezeStatus}`;
        }
      }
    });
  }

  updateDebugViews() {
    const scene_left = this.scene_left;

    if (!scene_left.portal_cube || !scene_left.sharedDebugRenderer) {
      return;
    }

    const debugDiv = document.getElementById("debug_uvs");
    const debugVisible = debugDiv && debugDiv.style.display !== "none";

    if (!debugVisible) {
      return;
    }

    scene_left.portal_cube.portals.forEach((portal) => {
      const mat = portal.material;
      if (!mat.debugCanvas) {
        return;
      }

      const canvas = mat.debugCanvas;
      const ctx = canvas.getContext("2d");

      // Render the portal scene using the shared renderer
      scene_left.sharedDebugRenderer.render(mat.portalScene, mat.portalCamera);

      // Copy the rendered result to this portal's debug canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(scene_left.sharedDebugRenderer.domElement, 0, 0);

      // Project cube face vertices to show UV mapping
      const geometry = portal.geometry;
      const positionAttr = geometry.getAttribute("position");
      const indexAttr = geometry.index;

      if (!positionAttr || !indexAttr) {
        return;
      }

      ctx.strokeStyle = "#FF0000";
      ctx.lineWidth = 2;

      const triangleCount = indexAttr.count / 3;
      const portalCamera = mat.portalCamera;
      portal.updateMatrixWorld();

      // Draw each triangle
      for (let i = 0; i < triangleCount; i++) {
        const projectedUVs = [];

        for (let j = 0; j < 3; j++) {
          const vertexIndex = i * 3 + j;
          const posIndex = indexAttr.getX(vertexIndex);

          const vertex = new THREE.Vector3(
            positionAttr.getX(posIndex),
            positionAttr.getY(posIndex),
            positionAttr.getZ(posIndex)
          );

          vertex.applyMatrix4(portal.matrixWorld);
          vertex.project(portalCamera);

          const u = vertex.x * 0.5 + 0.5;
          const v = vertex.y * 0.5 + 0.5;

          projectedUVs.push({
            x: u * canvas.width,
            y: (1 - v) * canvas.height,
          });
        }

        ctx.beginPath();
        ctx.moveTo(projectedUVs[0].x, projectedUVs[0].y);
        ctx.lineTo(projectedUVs[1].x, projectedUVs[1].y);
        ctx.lineTo(projectedUVs[2].x, projectedUVs[2].y);
        ctx.lineTo(projectedUVs[0].x, projectedUVs[0].y);
        ctx.stroke();
      }
    });
  }

  render() {
    const scene_left = this.scene_left;
    const scene_right = this.scene_right;
    const controls = this.controls;
    const self = this;

    function render_loop() {
      controls.update();
      requestAnimationFrame(render_loop);

        scene_left.camera.updateMatrixWorld();

        // Sync right camera with left camera
        scene_right.camera.position.copy(scene_left.camera.position);
        scene_right.camera.quaternion.copy(scene_left.camera.quaternion);
        scene_right.camera.zoom = scene_left.camera.zoom;
        scene_right.camera.updateProjectionMatrix();
        scene_right.camera.updateMatrixWorld();

        if (!window._FREEZE_ALL_PORTALS) {
        // Update portal cameras to match main camera position/rotation
        scene_left.portal_cube.portals.forEach((portal) => {
          const mat = portal.material;
          if (mat.portalCamera) {
            mat.portalCamera.position.copy(scene_left.camera.position);
            mat.portalCamera.quaternion.copy(scene_left.camera.quaternion);
            mat.portalCamera.updateMatrixWorld();
            scene_left.updatePortalUVs(portal, mat.portalCamera);
          }
        });
      }

      scene_left.renderer.depth = 0;
      scene_right.renderer.depth = 0;

      
      scene_left.renderer.render(scene_left.scene, scene_left.camera);
      scene_right.renderer.render(scene_right.scene, scene_right.camera);

      self.updateDebugViews();
    }
    render_loop();
  }
}

export { PerspectiveCameraTest };
