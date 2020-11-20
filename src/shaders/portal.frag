// Fragment Shader

uniform sampler2D internalSceneTexture;

void main() {
    gl_FragColor = texture2D(internalSceneTexture, gl_FragCoord.xy);
}
