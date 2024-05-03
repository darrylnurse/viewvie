import express, {request, response} from 'express';
import bodyParser from "body-parser";
import multer from 'multer';
import path from "node:path";
import cors from 'cors';
import splitVideo from './units/video-splitter.js';
import { Pinecone } from "@pinecone-database/pinecone";
import emitterSpawner from "./units/spawn-emitter.js";

import * as dotenv from "dotenv";
dotenv.config();
const API_KEY = process.env.PINECONE_API_KEY;

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const storageEngine = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "backend/uploads");
  },
  filename: (request, file, callback) => {
    console.log(file);
    const ext = file.originalname ? path.extname(String(file.originalname)) : '';
    const prefix = file.originalname
        .slice(0, file.originalname.indexOf('.'))
        .replace(/[_\s]+/g, '-')
        .toLowerCase();
    callback(null, prefix + '-' + Date.now() + ext);
  },
});

const upload = multer({
  storage: storageEngine,
  fileFilter: (request, file, callback) => {
    if(file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) callback(null, Boolean(1));
    else callback(null, false, new Error('You can only upload video files.'));
  }
});

app.use(cors());

let metadataTitle = "";
app.post('/admin/upload', upload.single('video'), (request, response) => {
  const path = request.file.path.replaceAll('\\', '/')
  console.log(path);
  try {
    splitVideo(path, './admin-output/');
    response.sendStatus(200);
  } catch (error){
    console.error(error);
    response.sendStatus(500);
  }

  metadataTitle = request.body.title[0];
  console.log("MetadataTitle:", metadataTitle);
});

app.post('/user/upload', upload.single('video'), (request, response) => {
  const path = request.file.path.replaceAll('\\', '/')
  console.log(path);
  try {
    splitVideo(path, './user-output/');
    response.sendStatus(200);
  } catch (error){
    console.error(error);
    response.sendStatus(500);
  }
});

const userOutputDir = path.join(__dirname, 'user-output');
const userEmitter = emitterSpawner(userOutputDir, 'user');

// add all vectors to an array
/*
* [
*   {values: [vector, of, embeddings]
*   ...
* ]
* */
// call find movie algorithm
// do calculations on the Map
// movieTitleFreq / Map size
// show x (3) movies
// iterate over movie and create an array of objects
// {movieName: movie, percentChance: x%}
userEmitter.on('newEmbedding', embedding => {
  console.log(`Here is your embedding: ${embedding}`); //we will use query vector here
});

// again add all vectors to an array, formatting each one with a random id and the movie title metadata
const adminOutputDir = path.join(__dirname, 'admin-output');
const adminEmitter = emitterSpawner(adminOutputDir, 'admin');
adminEmitter.on('newEmbedding', embedding => {
  console.log(`Here is your embedding: ${embedding}`); //we will use upsert vector here
  console.log(`Attached metadata is ${metadataTitle}`)
});

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

app.get("/user-results", (request, response) => {
  response.json({ //we will return the movie name here
    firstMovie: {
      title: "King Kong",
      percentage: 90
    },
    secondMovie: {
      title: "Igor",
      percentage: 40
    },
    thirdMovie: {
      title: "Minions",
      percentage: 5
    },
  })
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));

