const { Pinecone } =  require("@pinecone-database/pinecone");
const dotenv = require('dotenv');
dotenv.config();
const API_KEY = process.env.PINECONE_API_KEY;

const pinecone = new Pinecone({
  apiKey: API_KEY
});

const index = pinecone.index("viewvie");
//first embedding from video embedding user-output side
const queryVector = []; //array of floats between 0 - 1, -> [0.5, 0.6, ...]

const queryResponse = await index.namespace("ns1")
    .query({
      topK: 1, //returns 1 most similar vector
      vector: queryVector,
      includeValues: Boolean(1),
    });

const queryData = queryResponse.matches[0].metadata; // -> {movieName: "Godzilla Minus One"}
const {_, movieName} = queryData; // -> "Godzilla Minus One"