#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif

uniform vec2 u_samplePos;

highp float hash( in vec2 p ) {
  const highp float a = 12.9898;
  const highp float b = 78.233;
  const highp float c = 43758.5453;
  highp float dt = dot(p.xy, vec2(a,b));
  highp float sn = mod(dt, 3.14159);
  return fract(sin(sn) * c);
}

float noise( in vec2 p )
{
  vec2 i = floor( p );
  vec2 f = p - i;
	vec2 u = f*f*(3.0-2.0*f);

  return mix( mix( hash( i + vec2(0.0,0.0) ),
                   hash( i + vec2(1.0,0.0) ), u.x),
              mix( hash( i + vec2(0.0,1.0) ),
                   hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

float fbm (in vec2 p){
  const mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
  float f  = 0.50000000*noise( p ); p = m*p;
      	f += 0.25000000*noise( p ); p = m*p;
      	f += 0.12500000*noise( p ); p = m*p;
      	f += 0.06250000*noise( p ); p = m*p;
        f += 0.03125000*noise( p ); p = m*p;
      	f += 0.01562500*noise( p ); p = m*p;
        f += 0.00781250*noise( p ); p = m*p;
      	f += 0.00390625*noise( p ); p = m*p;
  return f;
}

float map (in vec2 p){
  return fbm(p * 0.01) * 40.0 + p.y - 6.0;
}

vec2 normal(in vec2 p){
  const vec2 eps = vec2(1.0, 0.0) * 0.001;
  return normalize(eps.xx * map(p + eps.xx) +
                   eps.xy * map(p + eps.xy) +
                   eps.yx * map(p + eps.yx) +
                   eps.yy * map(p + eps.yy));
}

void main() {
  vec2 uv = (gl_FragCoord.xy + u_samplePos * 0.25) / 16.0;

  float ran = hash(uv);
  vec3 col;

  float val = map(uv);

  if (val > 0.0){
    col = vec3(0.0,
      0.6 - (ran * val + val + ran * 0.5) *  0.1,
      0.1);
  } else {
    ran *= pow(ran, 48.0);
    ran *= ran * (3.0 - 2.0 * ran);
    ran *= fbm(uv * 0.25);

    col = mix(
      vec3(0.2, 0.0, 0.3),
      vec3(1.0, 1.0, 0.9),
      ran
    );

    col *= max(0.0, dot(normal(uv), vec2(-0.707))) * 0.6 + 0.4;
  }

  gl_FragColor = vec4(col, 1.0);
}
