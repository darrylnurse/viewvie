import express, {request, response} from 'express';
import bodyParser from "body-parser";
import multer from 'multer';
import path from "node:path";
import cors from 'cors';
import splitVideo from './units/video-splitter.js';
import { Pinecone } from "@pinecone-database/pinecone";
import emitterSpawner from "./units/spawn-emitter.js";
import * as dotenv from "dotenv";
import { fileURLToPath } from 'url';
import formatVector from "./units/format-vector.js";
import findMovie from "./units/find-movie.js";
import purgeDirectory from "./units/clear-directory.js";

dotenv.config();

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

app.post('/admin/upload', upload.single('video'), (request, response) => {
  const path = request.file.path.replaceAll('\\', '/')
  metadataTitle = request.body.title[0];
  try {
    splitVideo(path, './admin-output/');
    response.sendStatus(200);
  } catch (error){
    console.error(error);
    response.sendStatus(500);
  }
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

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY, //made an oopsie here before
});
const index = pinecone.index("viewvie");
const adminOutputDir = path.join(__dirname, 'admin-output');
const adminEmitter = emitterSpawner(adminOutputDir, "admin");
let adminVectors = [];
let metadataTitle = "";

adminEmitter.on('new-admin-embedding', embedding => {
  adminVectors.push(formatVector(embedding, (metadataTitle || "test")));
  // console.log(adminVectors);
  // console.log(adminVectors.length);
});

adminEmitter.on("admin-finished", () => {
  if (adminVectors.length > 0) {
    index.namespace("test").upsert(adminVectors)
        .then(() =>{
          console.log("Success!")
          adminVectors.length = 0;
        })
        .catch(err => console.error("Upsert failed:", err));
  } else {
    console.error("No vectors provided for upsertion.");
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

let userVectors = [];
userEmitter.on('new-user-embedding', embedding => { //we will use query vector here
  userVectors.push(formatVector(embedding, ""));
});

let userResults = null;
let resultArray = [];
let resultsReady = false;
userEmitter.on('user-finished', async () => {
  userResults = await findMovie(userVectors, 0.90);

  userVectors.length = 0;
  let total = userResults ? Array.from(userResults.values()).reduce((a, b) => a + b, 0) : 0;

  resultArray = [];  // Clear previous results
  userResults.forEach((value, key) => {
    resultArray.push({
      title: key,
      percentage: Math.floor(value / total * 100),
    });
  });

  resultsReady = Boolean(1);
});

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

app.get("/user-results", (request, response) => {
  if (!resultsReady) {
    return response.status(202).json({ message: "Results are still being prepared. Please try again later." });
  } else {
    response.json(resultArray.map((movieObject, index) => {
      return {
        title: movieObject.title,
        percentage: movieObject.percentage
      };
    }));
  }
});

purgeDirectory()
    .then(() =>
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`)));

