precision mediump float;

const int pointCount = 75;

uniform float pointsX[pointCount];
uniform float pointsY[pointCount];
uniform float intensities[pointCount];
uniform float reds[pointCount];
uniform float greens[pointCount];
uniform float blues[pointCount];


// SDF from Inigo Quilez: https://iquilezles.org/articles/distfunctions2d/
float sdStar5(in vec2 p, in float r, in float rf)
{
  const vec2 k1 = vec2(0.809016994375, -0.587785252292);
  const vec2 k2 = vec2(-k1.x,k1.y);
  p.x = abs(p.x);
  p -= 2.0*max(dot(k1,p),0.0)*k1;
  p -= 2.0*max(dot(k2,p),0.0)*k2;
  p.x = abs(p.x);
  p.y -= r;
  vec2 ba = rf*vec2(-k1.y,k1.x) - vec2(0,1);
  float h = clamp( dot(p,ba)/dot(ba,ba), 0.0, r );
  return length(p-ba*h) * sign(p.y*ba.x-p.x*ba.y);
}

vec4 DrawStar5WithRadius(vec2 fragPos, vec2 starPos, vec4 col, float intensity, float r, float rf)
{
  float len = sdStar5(fragPos - starPos, r, rf) + 6.;
  vec4 scaledCol = intensity * col;
  return len < 0.0 ? scaledCol : (scaledCol / len) + (scaledCol / (length(fragPos - starPos)));
}

void main()
{
  vec2 coord = gl_FragCoord.xy;
  // Reverse the coords because in webGL 0,0 is at the bottom left
  coord.y = 700. - coord.y;

  vec4 pixelColor = vec4(0.0, 0.0, 0.0, 1.0);

  for(int i = 0; i < pointCount; i ++)
  {
    pixelColor += DrawStar5WithRadius(
        coord, vec2(pointsX[i], pointsY[i]), 
        vec4(reds[i], greens[i], blues[i], 1.0), 
        intensities[i], 5.0, 1.8);
  }

  pixelColor += DrawStar5WithRadius(
    coord, vec2(350.0, 100.0), 
    vec4(1.0), 
    2.0, 15.0, 1.5
  );

  gl_FragColor = pixelColor;
}