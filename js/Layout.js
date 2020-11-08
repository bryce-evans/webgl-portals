



SceneManager = function () {
  this.scenes = [];
  this.screen_geometries = [];

  this.addMiniscene = function (miniscene, screen_geometry, transform) {
    this.scenes.push(miniscene);
    this.screen_geometries.push(screen_geometry);
  }

  this.render = function () {
    for (var i = 0; i < this.scenes.length; i++) {
      this.scenes[i].render()
    }

    for (var i = 0; i < face_uvs.length; i++) {
      // per tri
      var tri_uvs = face_uvs[i];
      var tri_vertices = face_idx[i];
      var tri_geometry = [vertices[tri_vertices['a']], vertices[tri_vertices['b']], vertices[tri_vertices['c']]]


      var canvas = canvas2ds[Math.floor(i / 2)];


      var uvs = [];
      for (var j = 0; j < tri_uvs.length; j++) {
        // per vertex

        // project to camera
        var vertex = tri_geometry[j];
        var projected = vertex.clone().project(miniscene_camera);
        projected.x = (projected.x + 1) / 2;
        projected.y = -(projected.y - 1) / 2;

        // For drawing UVs in debugger tools.
        uvs.push({ x: projected.x * width / 4, y: projected.y * height / 4 });

        // Set the UVs.
        var uv = tri_uvs[j];
        uv.x = projected.x;
        uv.y = 1 - projected.y;

      }
      drawTriangle(canvas, uvs[0], uvs[1], uvs[2]);

    }
    mainBoxObject.geometry.uvsNeedUpdate = true;




  }
}

this.renderTextureUVs = function () {

}

this.visible = function () {


}



