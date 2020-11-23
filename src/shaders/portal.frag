uniform float time;
uniform float scaleX;
uniform float scaleY;
varying vec2 vUv;
uniform sampler2D internalSceneTexture;


vec4 texture2DInterp( sampler2D sam, vec2 uv ) {
	vec2 res = vec2(textureSize( sam , 0).x, textureSize( sam , 0).y);
	//int vec2 res = textureSize( sam , 0);

    vec2 st = uv*res - 0.5;

    vec2 iuv = floor( st );
    vec2 fuv = fract( st );

    vec4 a = texture2D( sam, (iuv+vec2(0.5,0.5))/res );
    vec4 b = texture2D( sam, (iuv+vec2(1.5,0.5))/res );
    vec4 c = texture2D( sam, (iuv+vec2(0.5,1.5))/res );
    vec4 d = texture2D( sam, (iuv+vec2(1.5,1.5))/res );

    return mix( mix( a, b, fuv.x),
                mix( c, d, fuv.x), fuv.y );
}


void main() {
	//gl_FragColor = texture2D(internalSceneTexture, vUv);
gl_FragColor = texture2DInterp(internalSceneTexture, gl_FragCoord.xy / vec2(scaleX, scaleY));
}
