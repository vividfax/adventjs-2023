precision highp int;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;
attribute vec4 aVertexColor;

uniform vec3 uAmbientColor[5];

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform int uAmbientLightCount;

uniform bool uUseVertexColor;
uniform vec4 uMaterialColor;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vViewPosition;
varying vec3 vAmbientColor;
varying vec4 vColor;
varying mat3 mNormalMatrix;

void main(void) {
  vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);

  // Pass varyings to fragment shader
  vViewPosition = viewModelPosition.xyz;
  gl_Position = uProjectionMatrix * viewModelPosition;  

  vNormal = uNormalMatrix * aNormal;
  vTexCoord = aTexCoord;

  mNormalMatrix = uNormalMatrix;
  vColor = (uUseVertexColor ? aVertexColor : uMaterialColor);
}