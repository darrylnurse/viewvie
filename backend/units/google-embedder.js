const aiplatform = require('@google-cloud/aiplatform');

// quote is 300 concurrent reqs
// and maximum is 120 rqpm

async function cloudEmbed(baseImagePath = "") {
  const project = 'viewvie';
  const location = 'us-central1';

  // Imports the Google Cloud Prediction service client
  const {PredictionServiceClient} = aiplatform.v1;

  // Import the helper module for converting arbitrary protobuf.Value objects.
  const {helpers} = aiplatform;

  // Specifies the location of the api endpoint
  const clientOptions = {
    apiEndpoint: 'us-central1-aiplatform.googleapis.com',
    clientConfig: {
      interfaces: {
        'google.cloud.aiplatform.v1.PredictionService': {
          methods: {
            Predict: {
              timeout_millis: 60000,
            },
          },
        },
      },
    },
  };

  const publisher = 'google';
  const model = 'multimodalembedding@001';

  // Instantiates a client
  const predictionServiceClient = new PredictionServiceClient(clientOptions);

  // Configure the parent resource
  const endpoint = `projects/${project}/locations/${location}/publishers/${publisher}/models/${model}`;

  const fs = require('fs');
  const imageFile = fs.readFileSync(baseImagePath);

  // Convert the image data to a Buffer and base64 encode it.
  const encodedImage = Buffer.from(imageFile).toString('base64');

  const prompt = {
    image: {
      bytesBase64Encoded: encodedImage,
    },
  };
  const instanceValue = helpers.toValue(prompt);
  const instances = [instanceValue];

  const parameter = {
    sampleCount: 1,
    dimension: 512
  };
  const parameters = helpers.toValue(parameter);

  const request = {
    endpoint,
    instances,
    parameters,
  };

  const [response] = await predictionServiceClient.predict(request);
  const predictions =  response.predictions[0].structValue.fields.imageEmbedding.listValue.values;

  return predictions.map(prediction => prediction.numberValue);
}

// 512 dimensions
// cloudEmbed("C:\\Users\\Darst\\WebstormProjects\\viewvie\\backend\\input\\barremove.png")
//     .then(data => console.log(data));

module.exports = cloudEmbed;