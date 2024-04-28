import express, {request, response} from 'express';
import multer from 'multer';
import path from "node:path";
import splitVideo from '../microservices/video-splitter.js';

const app = express();
const PORT = 3000;

const storageEngine = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "../uploads");
  },
  filename: (request, file, callback) => {
    console.log(file);
    const ext = file.originalname ? path.extname(String(file.originalname)) : '';
    const prefix = file.originalname.slice(0, file.originalname.indexOf('.'));
    callback(null, prefix.replace('_', '-').toLowerCase() + '-' + Date.now() + ext);
  },
});

const upload = multer({
  storage: storageEngine,
  fileFilter: (request, file, callback) => {
    if(file.mimetype.startsWith('video/')) callback(null. Boolean(1));
    else callback(null, false, new Error('You can only upload video files.'));
  }
});

app.post('/upload', upload.single('video'), (request, response) => {
  response.send("Image uploaded!");
});

app.listen(PORT);
console.log(`Port is ${PORT}`);

//look into a good tutorial to upload videos to server lols
//process through the file system real quick