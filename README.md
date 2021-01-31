## TODO

Allow for offline use
add clipping planes shader (in ./ShaderChunk/clipping_planes[_pars]_fragment.glsl.js )
modify the shader to use the existing uber shader - but only with minor modification - instead of reimplementing every part of it
add physics engine for use in demos
implement teleport:
  collision with portals, duplicate object relative to outgoing portal
  allow for incoming and outgoing portal in the same scene
   

demos
  cube through portal and out another portal in same scene with clean clipping


# WebGL Portals

A framework built ontop of Three.js for adding portals into a WebGL scene.

Portals allow for the appearance of windows into alternate scenes, or a portal into another location in the main scene.

The core of the Portals framework extends Three.js classes: Material, Mesh, and Group.

This framework was written top down with final user-syntax being the center of the design.
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


### Structure and classes

#### PortalMaterial
Extends `THREE.Material`. A material that can be added to a PortalMesh to make it act like a portal. It dynamically updates to give the allusion of a 3D scene inside of the mesh the material is attached to.

#### PortalMesh
Extends `THREE.Mesh`. Requires a PortalMaterial to be attached. Makes the mesh act like a portal with the texture updating to the scene inside the associated PortalMaterial.

#### PortalLayout
Extends `THREE.Group`. A group of portals in a preset configuration. This is mostly useful for having all portals in a scene update with common changes. Several Three.js geometry primitives are included, as well as utils to split up additional geometric shapes and quickly create a unique scene inside each face.

### Scene Requirements & Limitations
The following should not happen and behavior is undefined:
* Portals cannot have intersections enabled and intersect another portal.
* An object cannot be touching two or more portals at the same time. 


### Resources

Render to Texture
https://gamedevelopment.tutsplus.com/tutorials/quick-tip-how-to-render-to-a-texture-in-threejs--cms-25686

Frame Buffer to Canvas Example
https://threejs.org/examples/webgl_framebuffer_texture

Clipping
https://threejs.org/examples/webgl_clipping.html

Multiple Scenes
https://threejsfundamentals.org/threejs/lessons/threejs-multiple-scenes.html


Ammo.js demo
http://kripken.github.io/ammo.js/examples/webgl_demo/ammo.html
https://github.com/schteppe/ammo.js-demos

Physi.js page + demo
https://chandlerprall.github.io/Physijs/