# WebGL Portals

A framework built ontop of Three.js for adding portals into a WebGL scene.

Portals allow for the appearance of windows into alternate scenes, or a portal into another location in the main scene.

This framework was written top down with intuitive usability as a focus.
The mechanics of rendering the scenes is kept internal.
To render a cube with each face showing a portal into a difference scene, only a few lines are needed:
```
    var cube_scenes = [];
    for (var i = 0; i < CubePortalLayout.maxScenes(); i++) {
      cube_scenes.push(new RandomGeometryScene({"size": 5}));
    }

    var portal_cube = new CubePortalLayout(cube_scenes, camera, this.renderer, { size: 10 });
    scene.add(portal_cube);
```

### Features
* Perspective correct textures through multiple layers of portals.
* Clean mesh clipping when entering a portal.
* Shaders extend Three.js base shaders to allow normal features and params to be used.


### Structure and classes
The core components of the Portals framework extends Three.js classes: Material, Mesh, and Group.

#### PortalMaterial
Extends `THREE.Material`. A material that can be added to a PortalMesh to make it act like a portal. It dynamically updates to give the allusion of a 3D scene inside of the mesh the material is attached to.

#### PortalMesh
Extends `THREE.Mesh`. Requires a PortalMaterial to be attached. Makes the mesh act like a portal with the texture updating to the scene inside the associated PortalMaterial.

#### PortalLayout
Extends `THREE.Group`. A group of portals in a preset configuration. This is mostly useful for having all portals in a scene update with common changes. Several Three.js geometry primitives are included, as well as utils to split up additional geometric shapes and quickly create a unique scene inside each face.

#### LinkedMesh [WIP]
Extends `THREE.Mesh`. When an object passes through a portal and comes through the outgoing side, it is temporarily duplicated to render on both ends smoothly. `LinkedMesh` allows for this to be abstracted away so that only a single object needs to be updated and linked meshes are kept in sync under the hood.

### Scene Requirements & Limitations
The following should not happen and behavior is undefined:
* Portals cannot have intersections enabled and intersect another portal.
* An object cannot be touching two or more portals at the same time. 
* At each step in time that a mesh is intersecting with a portal, it cannot be intersecting any other part of the portal plane (extended infinitely past the portal mesh) that is not part of the mesh itself, e.g. a horseshoe cannot dip one end in while the other end extends and wraps around the backside.


### Feature Requests & Future Work
* Cycle Portals - allow for the incoming and outgoing portal to be in the same scene.
* LinkedMesh - An abstraction to treat a mesh rendered in multiple scenes as a single object.
  * Updates to base apply to all others relative to their respective bases. As an object approaches a portal,
    the linked object behind the portal also moves closer, such that at intersection, both objects pass through the same way.
* Physics engine for use in demos
  * Collision detection with portals

### Resources & References

A collection of tutorials and demos whose concepts and/or techniques are integrated and make Portals.js possible.

* Render to Texture
  https://gamedevelopment.tutsplus.com/tutorials/quick-tip-how-to-render-to-a-texture-in-threejs--cms-25686

* Frame Buffer to Canvas Example
  https://threejs.org/examples/webgl_framebuffer_texture

* Clipping
  https://threejs.org/examples/webgl_clipping.html

* Multiple Scenes
  https://threejsfundamentals.org/threejs/lessons/threejs-multiple-scenes.html

* Physics Engine: Ammo.js demo
  http://kripken.github.io/ammo.js/examples/webgl_demo/ammo.html
  https://github.com/schteppe/ammo.js-demos

* Shaders
  * Fire https://www.shadertoy.com/view/MdKfDh
  * Water http://glslsandbox.com/e#39055.2