# dither post-processing in three.js

fragment shader converts to greyscale then applies 1bit or 2bit dithering using a bayer matrix

inspired by Lucas Pope's Return of the Obra Dinn

references used: <br>
https://en.wikipedia.org/wiki/Ordered_dithering <br>
http://alex-charlton.com/posts/Dithering_on_the_GPU/ <br>

![1bit-macintosh](gifs/1bit-macintosh.gif)
![1bit-ibm8503](gifs/1bit-ibm8503.gif)
![1bit-commodore1084](gifs/1bit-commodore1084.gif)
![2bit-scream](gifs/2bit-scream.gif)
