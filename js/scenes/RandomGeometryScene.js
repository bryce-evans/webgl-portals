 // Size of dummy objects
 var size = 5;

 var renderers = []
 var canvas2ds = []
 var buffer_textures = []
 var buffer_scenes = []
 var dummy_geos = [new THREE.BoxGeometry(size,size,size), new THREE.ConeGeometry(size,size, 6), new THREE.DodecahedronGeometry(size/2), new THREE.IcosahedronBufferGeometry(size/2), new THREE.TetrahedronBufferGeometry(size/2), new THREE.TorusGeometry(size/2, size/4, 10, 10)];


 var light_color = 0xffffff;
 var light_intensity = 1;
 