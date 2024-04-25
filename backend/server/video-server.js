import express from 'express';
import multer from 'multer';
import splitVideo from '../microservices/video-splitter.js';

const app = express();
splitVideo('./input/barremove.png');

const upload = multer({
  dest: 'output/'
});

// app.post('/upload', upload.single())

//look into a good tutorial to upload videos to server lols
//process through the file system real quick