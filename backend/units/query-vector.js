const { Pinecone } =  require("@pinecone-database/pinecone");
const dotenv = require('dotenv');
dotenv.config();
const API_KEY = process.env.PINECONE_API_KEY;

const pinecone = new Pinecone({
  apiKey: API_KEY
});

const index = pinecone.index("viewvie");
//first embedding from video embedding user-output side
//array of floats between 0 - 1, -> [0.5, 0.6, ...]

async function queryVector(vector) {
  const queryResponse = await index.namespace("test")
      .query({
        topK: 1, //returns 1 most similar vector
        vector: vector,
        includeValues: Boolean(1),
        includeMetadata: Boolean(1),
      });

  return queryResponse.matches[0]; // -> {movieName: "Godzilla Minus One"}
}

module.exports = queryVector;