// doesnt work 😭
// this is only possible in browser runtime
// possibly we create a browser runtime with puppeteer

const {
  ImageEmbedder,
  FilesetResolver
} = require('@mediapipe/tasks-vision');
const jsdom = require("jsdom");
const { JSDOM } = jsdom; //failed me !

const { document } = (new JSDOM(`...`)).window;

const embedImage = async imagePath => {
  const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );

  const imageEmbedder = await ImageEmbedder.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/image_embedder/mobilenet_v3_small/float32/1/mobilenet_v3_small.tflite`
    },
    runningMode: 'IMAGE',
    quantize: false,
  });

  let image = new Image();
  image.src = imagePath;
  document.window.document.append(image);

  return imageEmbedder.embed(image);
};

console.log(embedImage('./input/barremove.png'));
