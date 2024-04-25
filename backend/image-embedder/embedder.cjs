// embed image
// input -> path to image file
// output -> array of embeddings

// Import required modules
const fs = require('fs');

// Define the file path to your PNG image
const superman = '../image-embedder/superman.png';

// Read the PNG file
const supermanBuffer = fs.readFileSync(superman);

// Create an instance of the ImageEmbedder class
const imageEmbedder = ImageEmbedder.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/image_embedder/mobilenet_v3_small/float32/1/mobilenet_v3_small.tflite`
  },
});

// Embed the image
imageEmbedder.embed(supermanBuffer)
  .then(embedding => {
    // Access the embedding
    console.log('Image embedding:', embedding);
  })
  .catch(error => {
    // Handle any errors that occur during embedding
    console.error('Error:', error);
  });
