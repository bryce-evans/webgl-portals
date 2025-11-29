import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class GltfScene extends THREE.Scene {
    constructor(gltf_file, args) {
        const loader = new GLTFLoader();

        // Size of loaded objects
        this.size = args.size || 1;

        loader.load(gltf_file, function (gltf) {
            this.add(gltf.scene);
            // TODO: scale to size.
        }, undefined, function (error) {
            console.error(error);
        }.bind(this));
    }
}

exports = { GltfScene }