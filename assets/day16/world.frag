precision mediump float;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vViewPosition;
varying vec3 vAmbientColor;
varying vec4 vColor;

uniform sampler2D img;

void main() {
    // gl_FragColor = vec4(vTexCoord, 0.0, 1.0);
    gl_FragColor = texture2D(img, vTexCoord);
}