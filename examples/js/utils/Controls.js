/**
 * Improved controls over the standard THREE.OrbitControls.
 * Adds listeners to show debug info on keypress.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PortalMesh } from '../../../src/PortalMesh.js';


class Controls {
    constructor(camera, renderer) {
        this.orbit_controls = new OrbitControls(camera, renderer.domElement);
        this.orbit_controls.enableDamping = true;

        this.renderer = renderer;
        this.camera = camera;
        this.show_debug_uvs = false;
    }

    update() {
        this.orbit_controls.update();
    }
    
    addListeners() {
        function onWindowResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', onWindowResize.bind(this), false);

        window._FREEZE_ALL_PORTALS = false;
        $(document).keydown(function(event) {
            if (event.which == 32) {
                // space bar: Show debug pane.
                $('#debug_uvs').show();
                this.show_debug_uvs = true;
            } else if (event.which == 70) {
                // F: freeze textures.
                window._FREEZE_ALL_PORTALS = !window._FREEZE_ALL_PORTALS;
            }
        }.bind(this));

        $(document).keyup(function(event) {
            if (event.which == 32) {
                $('#debug_uvs').hide();
                this.show_debug_uvs = false;
            }
        }.bind(this));
    }
}

class ObjectPicker {
    constructor(domElement) {
        this.domElement = domElement;

        this.raycaster = new THREE.Raycaster();
        this.pickedObject = null;
        this.pickedObjectSavedColor = 0;

        this.mousedownPosition = { x: -1, y: -1 };
        this.mousedown = false;
        this.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (this.mobile) {
            // Mobile.
            domElement.addEventListener('touchstart', this.pointerDown.bind(this));
            domElement.addEventListener('touchstart', this.setPickPosition.bind(this));
            domElement.addEventListener('touchend', this.clickHandler.bind(this));
            domElement.addEventListener('touchmove', this.touchMove.bind(this));

        } else {
            // Desktop.
            domElement.addEventListener('pointerdown', this.pointerDown.bind(this));
            domElement.addEventListener('pointerdown', this.pointerDown.bind(this));
            domElement.addEventListener('pointerup', this.clickHandler.bind(this));

            domElement.addEventListener('mousemove', this.setPickPosition.bind(this));
            domElement.addEventListener('mouseout', this.clearPickPosition.bind(this));
            domElement.addEventListener('mouseleave', this.clearPickPosition.bind(this));
        }

        this.pickPosition = { x: 0, y: 0 };
        this.clearPickPosition();
    }

    pointerDown(event) {
        this.clicked = true;
        this.mousedown = true;
        this.mousedownPosition = { x: event.clientX, y: event.clientY };
    }

    getCanvasRelativePosition(event) {
        const rect = this.domElement.getBoundingClientRect();

        // Mobile handling.
        if (event.touches) {
            event = event.touches[0];
        }

        return {
            x: (event.clientX - rect.left) * this.domElement.width / rect.width,
            y: (event.clientY - rect.top) * this.domElement.height / rect.height,
        };
    }

    /**
     * Unused. TODO: fix this.
     * @param {*} event
     */
    onDrag(event) {
        console.log("mouse drag");
        const pos = this.getCanvasRelativePosition(event);
        const del_x = pos.x - this.mousedownPosition.x;
        const del_y = pos.y - this.mousedownPosition.y;
        if (del_x * del_x + del_y * del_y > 10) {
            console.log("dragged!");
            this.dragged = true;
        }
    }

    touchMove(event) {}

    /**
     * Set picked object, mark mouse moved.
     * @param {Event} event
     */
    setPickPosition(event) {
        const pos = this.getCanvasRelativePosition(event);
        this.pickPosition.x = (pos.x / this.domElement.width) * 2 - 1;
        this.pickPosition.y = (pos.y / this.domElement.height) * -2 + 1; // note we flip Y
    }

    clearPickPosition() {
        // unlike the mouse which always has a position
        // if the user stops touching the screen we want
        // to stop picking. For now we just pick a value
        // unlikely to pick something
        this.pickPosition.x = -100000;
        this.pickPosition.y = -100000;
        //console.log(this.pickPosition);
    }

    getEmissive(obj) {
        if (!(obj.material instanceof THREE.MeshPhongMaterial)) {
            return;
        }
        obj.material.emissive.getHex();
    }

    setEmissive(obj, color) {
        if (!(obj.material instanceof THREE.MeshPhongMaterial)) {
            return;
        }
        obj.material.emissive.setHex(color);
    }

    pick(scene, camera, time) {
        // Store previous data for restoring color.
        this.prevPicked = this.pickedObject;
        this.prevColor = this.pickedObjectSavedColor;

        var normalizedPosition = this.pickPosition;

        this.raycaster.setFromCamera(normalizedPosition, camera);
        var intersectedObjects = this.raycaster.intersectObjects(scene.children);

        var max_jumps = -1;
        while (intersectedObjects.length && max_jumps !== 0) {
            // pick the first object. It's the closest one
            var pickedObject = intersectedObjects[0].object;
            if (pickedObject instanceof PortalMesh) {
                //this.raycaster.setFromCamera(normalizedPosition, camera);
                //this.raycaster.setFromCamera(intersectedObjects[0].uv, pickedObject.material.camera);
                intersectedObjects = this.raycaster.intersectObjects(pickedObject.material.scene.children);
                max_jumps--;
            } else {
                break;
            }
        }

        // New valid picked object.
        this.pickedObject = pickedObject;
        if (pickedObject && !pickedObject.clicked) {
            if (pickedObject !== this.prevPicked) {
                this.pickedObjectSavedColor = this.getEmissive(pickedObject);
            }

            // Set its emissive color to flashing red/yellow:

            // Blink.
            //pickedObject.material.emissive.setHex((time * 1000) % 2 > 1 ? 0xFFFF00 : 0xFF0000);

            // Highlight on hover only.
            if (!this.mousedown && !this.mobile) {
                // Smooth transition between red and orange.
                this.setEmissive(pickedObject, (0xFF0000 + ((((Math.cos(time * 2000) + 1) / 2) * 0xFF) << 8)));
            }
        }

        // Handle click events.
        // We put this here to handle the case the click comes in the middle of executing this fn.

        // If there's a click, set to white no matter what.
        if (this.clicked && this.pickedObject) {
            this.setEmissive(this.pickedObject, 0xFFFFFF);
            this.pickedObject.clicked = true;
            this.pickedObjectSavedColor = 0xFFFFFF;
        }
        this.clicked = false;

        // No picked object, reset the color of the last touched item.
        if (this.prevPicked && this.prevPicked != pickedObject && !this.prevPicked.clicked) {
            this.setEmissive(this.prevPicked, this.prevColor);
        }
    }

    clickHandler(e) {
        this.mousedown = false;
        //mouse is up, reset down position
        this.mousedownPosition = { x: -1, y: -1 };
    }
}


export { Controls, ObjectPicker };