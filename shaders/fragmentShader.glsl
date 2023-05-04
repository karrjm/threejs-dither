uniform sampler2D tDiffuse;
varying vec2 vUv;

void main() {
  vec4 color = texture2D(tDiffuse, vUv);

  // https://en.wikipedia.org/wiki/Ordered_dithering#Threshold_map
  const int indexMatrix4x4[16] = int[](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);

    // converting to less colors (grayscale) using gamma formula
  float grey = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
  grey = grey / 0.039;
  grey = floor(grey + 0.5);
  grey = grey * 0.039;

    // get dithering threshold with modulos
  int x = int(mod(gl_FragCoord.x, 4.0));
  int y = int(mod(gl_FragCoord.y, 4.0));
  int index = (x + y * 4); // index of pseudomatrix
  float dither = float(indexMatrix4x4[index]) / 16.0;

  // 1bit threshold
  if(grey > dither) {
    // gl_FragColor = vec4(1.0f, 1.0f, 1.0f, 1.0f); // white

    gl_FragColor = vec4(0.9f, 1.0f, 1.0f, 1.0f); // obra dinn macintosh
    // gl_FragColor = vec4(0.53f, 0.84f, 0.87f, 1.0f); // obra dinn commodore 1084
    // gl_FragColor = vec4(0.92f, 0.9f, 0.81f, 1.0f); // obra dinn ibm 8503

  } else {
    // gl_FragColor = vec4(0.0f, 0.0f, 0.0f, 1.0f); // black

    gl_FragColor = vec4(0.2f, 0.2f, 0.1f, 1.0f); // obra dinn macintosh
    // gl_FragColor = vec4(0.25f, 0.19f, 0.56f, 1.0f); // obra dinn commodore 1084
    // gl_FragColor = vec4(0.18f, 0.19f, 0.22f, 1.0f); // obra dinn ibm 8503
  }

  //  // 2bit threshold
  // float shine = dither + 0.14; // 2nd highlight threshold
  // float highlight = dither + 0.22; // main highlight threshold

  // if(grey > highlight) {
  //   gl_FragColor = vec4(0.79f, 0.96f, 0.2f, 1.0f);
  // } else if(grey > shine) {
  //   gl_FragColor = vec4(0.45f, 0.69f, 0.2f, 1.0f);
  // } else if(grey > dither) {
  //   gl_FragColor = vec4(0.36f, 0.31f, 0.64f, 1.0f);
  // } else {
  //   gl_FragColor = vec4(0.34f, 0.11f, 0.09f, 1.0f);
  // }
}