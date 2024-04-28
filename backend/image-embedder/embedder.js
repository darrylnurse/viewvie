import fs from 'fs';
import {ImageEmbedder} from "@mediapipe/tasks-vision";

let image;

fs.readFile("../image-embedder/superman.jpg", (err, img) =>{
    if(err){
        console.log("Error: ", err);
        return;
    }

    image = img;
});

const imgEmbedder = new ImageEmbedder;
const imageEmbedding = imgEmbedder.embed(image);

console.log("Embedding: ", imageEmbedding);

