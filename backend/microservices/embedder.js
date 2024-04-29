// embed image
// input -> path to image file
// output -> array of embeddings

// const tf = require('@tensorflow/tfjs-node'); //this needs to be npm installed but please put it in gitignore it is HUGE
// const {readFileSync} = require("fs");
//
// async function loadImageAndGetEmbedding(imagePath) {
//   const imageBuffer = readFileSync(imagePath);
//   const imageTensor = tf.node.decodeImage(imageBuffer);
//   return imageTensor; //testing
//   // const model = await tf.loadLayersModel('file://C:/Users/Darst/Downloads/archive/saved_model.pb'); //error is here, model should be in json format???
//   // const embedding = model.predict(imageTensor.expandDims(0));
//   // return embedding.dataSync();
// }
//
// // Example usage
// loadImageAndGetEmbedding('./uploads/barremove-frame-1.jpg').then(embedding => {
//   console.log('Image embedding:', embedding);
// });


// DO NOT USE TENSOR JS IS LIKE TOTALLY SUCKS DUDE

// this file will be unused but leaving it to avoid merge conflicts
