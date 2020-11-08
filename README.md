
# Three JS Portals

Terminology:
A Miniscene is contained inside the portal. 
The portal is a mesh that renders the miniscene.
A Portal Layout just a group of these portals in a preset configuation.


This framework was written top down with final user-syntax being the center of the design. 
To render a cube with each face showing a portal into a difference scene, only a few lines are needed:
```
    portal_cube = CubePortalLayout(size = 10);
    portal_cube.setCamera(camera);
    for (var i = 0; i < portal_cube.n_windows(); i++) {
      portal_cube.setScene(i, new RandomGeometryScene());
    }
    scene.add(portal_cube);
```


### Structure and classes

#### MiniScene
A wrapper around THREE.Scene with some needed extras to support adding the scene into a window.


#### Portal Window
A window into a scene. Takes a scene, camera, and geometry to project to (usually just a triangle or plane). Internally has a number of optimizations to minimize overhead, and also includes support for mouse events into the contained scene (Overing over the portal window can get the hovered object from within the internal scene). 

In most cases the camera will want to be the camera of the main scene. 

#### Portal Layout
A structure of several portals. These are essentially just a THREE.Group of portal windows, but contains additional optimizations as well as useful preset geometries. A `CubePortalLayout` is a Cube with each face showing a different Scene, but could be constructed with 6 independent `PortalWindows` with a plane added as the portal geometry.



### Resources

Render to texture
https://gamedevelopment.tutsplus.com/tutorials/quick-tip-how-to-render-to-a-texture-in-threejs--cms-25686


Multiple scenes
https://threejsfundamentals.org/threejs/lessons/threejs-multiple-scenes.html