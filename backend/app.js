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
//import findMovie from "./units/find-movie.js";
import purgeDirectory from "./units/clear-directory.js";
import queryVector from "./units/query-vector.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

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
  resultsReady = false;
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
  resultsReady = false;
  const path = request.file.path.replaceAll('\\', '/');
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
});

adminEmitter.once("admin-finished", () => {
  if (adminVectors.length > 0) {
    index.namespace("test").upsert(adminVectors)
        .then(() =>{
          console.log("Vectors upserted successfully.");
          adminVectors.length = 0;
        })
        .catch(err => console.error("Upsert failed:", err));
  } else {
    console.error("No vectors provided for upsertion.");
  }
});

const userOutputDir = path.join(__dirname, 'user-output');
const userEmitter = emitterSpawner(userOutputDir, 'user');

//let userVectors = [];

const userMap = new Map();
const threshold = 0.99;

userEmitter.on('new-user-embedding', async embedding => { //we will use query vector here
  const vector = formatVector(embedding, "");
  const queryResult = await queryVector([...vector.values]);
  if(queryResult && queryResult.score > threshold){
    userMap.set(queryResult.metadata.movieTitle, (userMap.get(queryResult.metadata.movieTitle) || 0) + 1);
  }
});

console.log(userMap);

// let userResults = null;
let resultArray = [];
let resultsReady = false;

userEmitter.on('user-finished', async () => {
  //userResults = await findMovie(userVectors, 0.95);
  console.log(userMap);

  //userVectors.length = 0;
  let total = userMap ? Array.from(userMap.values()).reduce((a, b) => a + b, 0) : 0;

  resultArray = [];
  userMap.forEach((value, key) => {
    resultArray.push({
      title: key,
      percentage: Math.floor(value / total * 100),
    });
  });

  console.log(resultArray);

  resultsReady = Boolean(1);

  userMap.clear();
});

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

process.on('exit', () => {
  adminEmitter.removeAllListeners();
  userEmitter.removeAllListeners();
});

app.get("/user-results", (request, response) => {
  if (!resultsReady) {
    return response.status(202).json({ message: "Results are still being prepared. Please try again later." });
  } else {
    response.json(resultArray.map(movieObject => {
      return {
        title: movieObject.title,
        percentage: movieObject.percentage
      };
    }));
  }
  resultArray.length = 0;
});

purgeDirectory(
    "./backend/admin-output",
    "./backend/user-output",
    "./backend/uploads"
).then(() =>
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`)));
