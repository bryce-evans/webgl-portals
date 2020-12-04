/* A standard texture shader (no lighting) that excludes affine (w) correction.
 * This is required for correct perspective view when using portals because the
 * affine correction has already been handled by the rendering of the internal
 * to the input texture we show on the portal surface here.
 */


// Texture of the portal scene to render.
uniform sampler2D internalSceneTexture;
uniform vec2 textureSize;

// Dimensions of the rendered view.
uniform float dim_x;
uniform float dim_y;

varying vec2 vUv;
uniform bool frozen;


// Bilinear Interpolation.
vec4 texture2DInterp( sampler2D sam, vec2 sam_size, vec2 uv ) {
    vec2 st = uv * sam_size - 0.5;

    vec2 iuv = floor(st);
    vec2 fuv = fract(st);

    vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) / sam_size);
    vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) / sam_size);
    vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) / sam_size);
    vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) / sam_size);

    return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}


void main() {
    if (frozen){
        gl_FragColor = texture2DInterp(internalSceneTexture, textureSize, vUv);
    } else {
        gl_FragColor = texture2DInterp(internalSceneTexture, textureSize, gl_FragCoord.xy / vec2(dim_x, dim_y));
    }
}
