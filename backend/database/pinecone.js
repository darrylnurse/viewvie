import { Pinecone } from "@pinecone-database/pinecone";
import createVectorObjects from "./fake-vectors.js";
import * as dotenv from "dotenv";
dotenv.config();
const API_KEY = process.env.PINECONE_API_KEY;

<<<<<<< HEAD
//whatever file calls the emitter will continuously run to watch for new files
// {persistent : Boolean(1)}
=======
>>>>>>> d5d0cfd8aa8e310df2aae089b7702bfea2b55445
import emitter from "./emitter.js";

const pinecone = new Pinecone({
  apiKey: API_KEY
});

// use this if you haven't created an index already
// but index is already created !!!
// await pinecone.createIndex({
//   name: 'viewvie',
//   dimension: 8,
//   metric: 'euclidean',
//   spec: {
//     serverless: {
//       cloud: 'aws',
//       region: 'us-west-2'
//     }
//   }
// });

const index = pinecone.index("viewvie");

// add single entry to namespace
// await index.namespace("ns1").upsert([
//   {
//     "id": "teesha",
//     "values": [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
//     "metadata": {
//       "title": "jurassic park III",
//     }
//   }
// ]);

//Adds entries to namespace
// await index.namespace("test").upsert(createVectorObjects(520, 10, "movieTitle", "Howl's Moving Castle"))
//     .then(() => console.log("Success!"));

// we need function to turn single embedding into format that can be upserted
// creates one embedding and turns it into vector object

// emitter.on('newEmbedding', async embedding => { // this is the function triggered each time by emitter signal
//   await index.namespace("test")
//       .upsert(embedding)
//       .then(() => console.log("Success!"));
// })

emitter.on('newEmbedding', embedding => {
  console.log('Woo!');
})

// Gets all stats of index
// const stats = await index.describeIndexStats();
// console.log(stats);

// Gets all ids in namespace
// const testIndex = pinecone.index('viewvie').namespace('test');
// const vectors = await testIndex.listPaginated();
// const ids = vectors['vectors'].map(vector => vector.id);
// console.log(ids);

// Queries namespace
// const queryResponse = await index.namespace("ns1")
//     .query({
//       topK: 2,
//       vector: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7],
//       includeValues: Boolean(1),
//     })
//
// console.log(queryResponse);

//DANGER ZONE - DELETE ALL VECTORS
// const testIndex = pinecone.index('viewvie').namespace('test');
// await testIndex.deleteAll()
//     .then(() => console.log("All record deleted."));