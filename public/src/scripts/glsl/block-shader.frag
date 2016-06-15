#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif

uniform sampler2D u_sampler;

varying vec2 v_textureCoord;

void main() {
   gl_FragColor = vec4(1, 0.5, 0, 1);
}
