import * as THREE from 'three';

class RandomGeometryScene extends THREE.Scene {

    constructor(options={}) {
        super(options);
        // Size of dummy objects
        this.size = options.size || 1;

        this.init();
    }

    randGeometry(size) {
        var size = this.size;
        switch (Math.floor(Math.random() * 6)) {
            case 0:
                return new THREE.BoxGeometry(size, size, size);
            case 1:
                return new THREE.ConeGeometry(size/2, size, 32);
            case 2:
                return new THREE.DodecahedronGeometry(size / 2);
            case 3:
                return new THREE.IcosahedronGeometry(size / 2);
            case 4:
                return new THREE.TetrahedronGeometry(size);
            case 5:
                return new THREE.TorusGeometry(size / 2, size / 4, 32, 32);
        }
    }

    randPhongMaterial() {
        var hue = Math.random() * 360;
        return new THREE.MeshLambertMaterial({
            color: new THREE.Color("hsl(" + hue + ", 100%, 60%)"),
            flatShading: true
        });
    }

    randComplementPhongMaterials() {
        var hue = Math.random() * 360;
        var shift = Math.random() * 60 + 120;
        var primary = new THREE.MeshLambertMaterial({
            color: new THREE.Color("hsl(" + hue + ", 100%, 60%)"),
            flatShading: true
        });
        var secondary = new THREE.MeshLambertMaterial({
            color: new THREE.Color("hsl(" + (hue + shift) + ", 100%, 60%)"),
            flatShading: true
        });
        return [primary, secondary];
    }

    init(room_geo = new THREE.BoxGeometry(2 * this.size, 2 * this.size, 2 * this.size)) {
        const white = 0xffffff;
        const blue = 0x000FFF;

        const light1 = new THREE.PointLight(white, 600);
        light1.position.set(15, 3, 0);
        this.add(light1);

        const light2 = new THREE.PointLight(blue, 30);
        light2.position.set(1, 12, 0);
        this.add(light2);

        this.add(new THREE.AmbientLight(white, 0.2));

        let materials = this.randComplementPhongMaterials();
        if (room_geo != null) {
            var room_mat = materials[0];
            room_mat.side = THREE.BackSide
            var room = new THREE.Mesh(room_geo, room_mat);
            this.add(room);
        }

        var subject = new THREE.Mesh(this.randGeometry(), materials[1]);
        this.add(subject);
    }
}

export { RandomGeometryScene }