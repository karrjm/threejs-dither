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
    // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // white

    gl_FragColor = vec4(0.9, 1.0, 1.0, 1.0); // obra dinn macintosh
    // gl_FragColor = vec4(0.53, 0.84, 0.87, 1.0); // obra dinn commodore 1084
    // gl_FragColor = vec4(0.92, 0.9, 0.81, 1.0); // obra dinn ibm 8503
    // gl_FragColor = vec4(0.89, 0.27, 0.96, 1);

  } else {
    // gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // black

    gl_FragColor = vec4(0.2, 0.2, 0.1, 1.0); // obra dinn macintosh
    // gl_FragColor = vec4(0.25, 0.19, 0.56, 1.0); // obra dinn commodore 1084
    // gl_FragColor = vec4(0.18, 0.19, 0.22, 1.0); // obra dinn ibm 8503
    // gl_FragColor = vec4(0.77, 0.18, 0.11, 1);

  }

  //  // 2bit threshold
  // float shine = dither + 0.2; // 2nd highlight threshold
  // float highlight = dither + 0.5; // main highlight threshold

  // if(grey > highlight) {
  //   gl_FragColor = vec4(0.99, 0.99, 0.91, 1.0);
  // } else if(grey > shine) {
  //   gl_FragColor = vec4(0.05, 0.31, 1.0, 1.0);
  // } else if(grey > dither) {
  //   gl_FragColor = vec4(0.15, 0.01, 0.76, 1.0);
  // }// } else {
  // //   gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  // // }
}