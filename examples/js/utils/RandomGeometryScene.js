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
        return new THREE.MeshPhongMaterial({ color: new THREE.Color("hsl(" + hue + ", 100%, 50%)") });
    }

    randComplementPhongMaterials() {
        var hue = Math.random() * 360;

        // var shifts = [60, 120, 180];
        // var shift = shifts[Math.floor(Math.random() * shifts.length)];
        var shift = Math.random() * 60 + 120;
        var primary = new THREE.MeshPhongMaterial({ color: new THREE.Color("hsl(" + hue + ", 100%, 50%)") });
        var secondary = new THREE.MeshPhongMaterial({ color: new THREE.Color("hsl(" + (hue + shift) + ", 100%, 50%)") });
        return [primary, secondary];
    }

    init(room_geo = new THREE.BoxGeometry(2 * this.size, 2 * this.size, 2 * this.size)) {
        var light_color = 0xffffff;
        var light_intensity = 0.6;

        // TODO: make these relative to size.
        var l_pos = [[0, 3, 15], [0, 3, -15],[5, 12, 0]];
        for (var i = 0; i < l_pos.length; i++) {
            var pos = l_pos[i];
            var light = new THREE.PointLight(light_color, light_intensity);
            light.position.set(pos[0], pos[1], pos[2]);
            this.add(light);
        }

        // const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        // directionalLight.position.set(0,-4,0);
        // this.add( directionalLight );
        
        this.add(new THREE.AmbientLight(0xfffff, 0.6));

        let materials = this.randComplementPhongMaterials();
        if (room_geo != null) {
            var room_mat = materials[0];
            room_mat.side = THREE.BackSide
            var room = new THREE.Mesh(room_geo, room_mat);
            this.add(room);
        }

        var subject = new THREE.Mesh(this.randGeometry(), materials[1]);
        // this.id = subject.material.color;
        this.add(subject);
    }
}

export { RandomGeometryScene }