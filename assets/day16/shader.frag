precision mediump float;

varying mat3 mNormalMatrix;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vViewPosition;
varying vec3 vAmbientColor;
varying vec4 vColor;

uniform vec3 color1;
uniform vec3 color2;
uniform float shiny1;
uniform float shiny2;
uniform float scale;
uniform vec3 paper;
uniform int mode;
uniform float angle;
uniform vec2 offset;

vec2 rand(vec2 p) {
    return vec2(
        fract(sin(dot(p, vec2(12.9898, 4.1414))) * 43758.5453),
        fract(sin(dot(p, vec2(5.24314, 7.4321))) * 3251.3215)
    );
}

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float noise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec2 noise2(vec2 p) {
    //TODO better noise
    return 0.5 + 0.5 * vec2(noise(p), noise(p+vec2(3243.31, 5346.35)));
}
vec2 noise2(ivec2 p) {
    vec2 q = vec2(float(p.x), float(p.y));
    return noise2(q);
}

vec3 noise3(vec2 p) {
    //TODO better noise
    return 0.5 + 0.5 * vec3(noise(p), noise(p+vec2(3243.31, 5346.35)), noise(p+vec2(3546.36, 1254.534)));
}

float voronoiDistance( in vec2 x )
{
    ivec2 p = ivec2(floor( x ));
    vec2  f = fract( x );

    ivec2 mb;
    vec2 mr;

    float res = 8.0;
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        ivec2 b = ivec2(i, j);
        vec2  r = vec2(b) + noise2(p+b)-f;
        float d = dot(r,r);

        if( d < res )
        {
            res = d;
            mr = r;
            mb = b;
        }
    }

    res = 8.0;
    for( int j=-2; j<=2; j++ )
    for( int i=-2; i<=2; i++ )
    {
        ivec2 b = mb + ivec2(i, j);
        vec2  r = vec2(b) + noise2(p+b) - f;
        float d = dot(0.5*(mr+r), normalize(r-mr));

        res = min( res, d );
    }

    return res;
}
  const vec2 shex = vec2(1, 1.7320508);
  float hex(in vec2 p){

      p = abs(p);

      return max(dot(p, shex*.5), p.x); // Hexagon.

  }
  vec4 getHex(vec2 p){

      vec4 hC = floor(vec4(p, p - vec2(.5, 1))/shex.xyxy) + .5;

      vec4 h = vec4(p - hC.xy*shex, p - (hC.zw + .5)*shex);

      return dot(h.xy, h.xy)<dot(h.zw, h.zw) ? vec4(h.xy, hC.xy) : vec4(h.zw, hC.zw + vec2(.5, 1));

  }

int stripes(vec2 tex) {
    float pos = fract(tex.x + tex.y);
    if (pos < 0.5) {
        return 0;
    } else {
        return 1;
    }
}

int check(vec2 tex) {
    vec2 f = fract(tex);
    if (f.x < 0.5 ^^ f.y < 0.5) {
        return 0;
    } else {
        return 1;
    }
}

int spots(vec2 tex) {
    vec2 f = fract(tex);
    vec2 repeat = tex - f;
    float d = 10.0;
    for (int x = -1; x < 2; x++) {
        for (int y = -1; y < 2; y++) {
            vec2 o = vec2(float(x), float(y));
            vec2 ran = rand(repeat + o);
            vec2 c = ran + o;
            float r = mix(0.1, 0.8, rand(ran).x);
            d = min(d, length(f - c)/r);
        }
    }
    if (d < 1.0) {
        return 0;
    } else {
        return 1;
    }
}

int marble(vec2 tex) {
    float z = fract(noise(tex * 0.25 + .5 * noise2(tex * 0.5)) * 10.0 / scale);
    if (z < 0.5) {
        return 0;
    } else {
        return 1;
    }
}

int blobs(vec2 tex) {
    float z = noise(tex / 4.0);
    if (abs(z) < 0.45) {
        return 0;
    } else {
        return 1;
    }
}

int voronoi(vec2 tex) {
    if (fract(voronoiDistance(tex) * 3.0 - 0.25) < 0.5) {
        return 0;
    } else {
        return 1;
    }
}

int mandel(vec2 tex) {
    vec2 pos = vec2(0.42884,-0.231345) + tex * 0.001;
    vec2 z = vec2(0.0);
    int c = 1;
    for (int i = 0; i < 32; i++) {
        c = 1-c;
        z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + pos;
        if (length(z) > 2.0) {
            break;
        }
    }
    return c;
}

int truchet(vec2 tex) {
    vec2 f = fract(tex * 2.0);
    vec2 repeat = tex * 2.0 - f;
    if (rand(repeat).x < 0.5) f.x = 1.0 - f.x;
    if (abs(f.x - f.y) < 0.25) {
        return 0;
    } else {
        return 1;
    }
}

int truchet2(vec2 tex) {
    vec2 f = fract(tex * 1.5);
    vec2 repeat = tex * 1.5 - f;
    if (rand(repeat).x < 0.5) f.x = 1.0 - f.x;
    if (abs(length(f) - 0.5) < 0.125 || abs(length(1.0 - f) - 0.5) < 0.125) {
        return 0;
    } else {
        return 1;
    }    
}

int noisegrid(vec2 tex) {
    vec2 f = fract(tex * 3.0);
    vec2 repeat = tex * 3.0 - f;
    vec2 pos = abs(f - 0.5);
    float fbm = noise(repeat/4.0) + noise(repeat*2.0);
    if (fbm > 0.0 && min(f.x, f.y) > 0.375) {
        return 0;
    } else {
        return 1;
    }
}

int hexgrid(vec2 tex) {
    vec4 h = getHex(tex);
    // const mat2 m = mat2(shex.x, shex.y, -shex.y, shex.x) / 2.0;
    // float r = rand(h.zw).x * 6.0;
    // vec2 v = h.xy;
    // for (int i = 0; i < 6; i++) {
    //     if (float(i) < r) v = m * v;
    // }
    if (rand(h.zw).x > 0.5) {
        return 0;
    } else {
        return 1;
    }
}
int hextruchet(vec2 tex) {
    vec4 h = getHex(tex);
    const mat2 m = mat2(shex.x, shex.y, -shex.y, shex.x) / 2.0;
    float r = rand(h.zw).x * 6.0;
    vec2 v = h.xy;
    for (int i = 0; i < 6; i++) {
        if (float(i) < r) v = m * v;
    }
    if (v.x > 0.0) {
        return 0;
    } else {
        return 1;
    }
}

int snowflake(vec2 tex) {
    vec4 h = getHex(tex);
    vec2 v = h.xy;
    const mat2 m = mat2(shex.x, -shex.y, shex.y, shex.x) / 2.0;
    const vec2 s = vec2(shex.x, -shex.y) / 2.0;
    if (v.x < 0.0) v.x = -v.x;
    if (v.y < 0.0) v.y = -v.y;
    if (dot(v, s) < 0.0) v = m * v;
    if (v.y < 0.0) v.y = -v.y;
    if (v.x > 0.375) return 0;
    return hextruchet((v + 5.0 * h.zw) * 8.0);
}

int zigzag(vec2 tex) {
    vec2 v = fract(tex);
    if (v.x > 0.5) v.x = 1.0 - v.x;
    return fract(v.y - v.x) < 0.5 ? 1 : 0;
}

vec3 phong(vec3 color, vec3 n, vec3 dir, float k) {
    vec3 r = normalize(2.0 * dot(dir, n) * n - dir);
    vec3 v = normalize(vViewPosition);
    return color * clamp(dot(n, dir), 0.0, 1.0) + 0.25 * mix(color, vec3(0.5), 0.5) * pow(clamp(dot(r, v), 0.0, 1.0), k);
}

void main() {
    float n = dot(vNormal, normalize(vViewPosition));
    vec2 scaledTex = vTexCoord * vec2(0.8, 2.6) + offset;
    vec3 normal = normalize(
        vNormal + mNormalMatrix *
        (0.2 * noise3(scaledTex * 0.3)
         + 0.1 * noise3(scaledTex * 0.7)));
    float shiny = 1.0;
    vec3 basecolor = paper;
    if (n < 0.0) {
        int color = 0;
        vec2 tex = vTexCoord * scale;
        mat2 m = mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
        tex = m * tex + offset;

        if (mode == 0) {
            color = stripes(tex);
        } else if (mode == 1) {
            color = check(tex);
        } else if (mode == 2) {
            color = spots(tex);
        } else if (mode == 3) {
            color = marble(tex);
        } else if (mode == 4) {
            color = blobs(tex);
        } else if (mode == 5) {
            color = voronoi(tex);
        } else if (mode == 6) {
            color = mandel(tex);
        } else if (mode == 7) {
            color = truchet(tex);
        } else if (mode == 8) {
            color = truchet2(tex);
        } else if (mode == 9) {
            color = noisegrid(tex);
        } else if (mode == 10) {
            color = hexgrid(tex);
        } else if (mode == 11) {
            color = hextruchet(tex);
        } else if (mode == 12) {
            color = snowflake(tex);
        } else if (mode == 13) {
            color = zigzag(tex);
        }

        if (color == 0) {
            basecolor = color1;
            shiny = shiny1;
        } else {
            basecolor = color2;
            shiny = shiny2;
        }
    } else {
        normal = -normal;
    }
    vec3 light = 0.01 * basecolor;
    light += vec3(0.7, 0.6, 0.5) * phong(basecolor, normal, vec3(0.0, -0.8, 0.6), shiny);
    light += vec3(0.5, 0.6, 0.7) * phong(basecolor, normal, vec3(-0.8, -0.6, 0.0), shiny);
    light += vec3(0.7, 0.5, 0.7) * phong(basecolor, normal, vec3(0.0, 0.6, 0.8), shiny);
    light += vec3(0.1, 0.08, 0.05) * phong(basecolor, normal, vec3(0.8, -0.6, 0.0), shiny);
    
    light *= 0.7;
    gl_FragColor = vec4(light, 1.0);
    gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(0.45));
}