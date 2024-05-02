import express, {request, response} from 'express';
import multer from 'multer';
import path from "node:path";
import splitVideo from './microservices/video-splitter.js';
import { Pinecone } from "@pinecone-database/pinecone";
import emitterSpawner from "./microservices/spawn-emitter.js";

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

app.post('/admin/upload', upload.single('video'), (request, response) => {
  const path = request.file.path.replaceAll('\\', '/')
  console.log(path);
  try {
    splitVideo(path, './admin-output/');
  } catch (error){
    console.error(error);
  }
});

app.post('/user/upload', upload.single('video'), (request, response) => {
  const path = request.file.path.replaceAll('\\', '/')
  console.log(path);
  try {
    splitVideo(path, './user-output/');
  } catch (error){
    console.error(error);
  }
});

const userOutputDir = path.join(__dirname, 'user-output');
const userEmitter = emitterSpawner(userOutputDir, 'user');
userEmitter.on('newEmbedding', embedding => {
  console.log(`Here is your embedding: ${embedding}`); //we will use query vector here
});

const adminOutputDir = path.join(__dirname, 'admin-output');
const adminEmitter = emitterSpawner(adminOutputDir, 'admin');
adminEmitter.on('newEmbedding', embedding => {
  console.log(`Here is your embedding: ${embedding}`); //we will use upsert vector here
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));

