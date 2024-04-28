const fs = require('fs');
const path = require('path');

const ffmpeg = require('fluent-ffmpeg');
const child = require('child_process');

console.log("Ready to start processing");

const filePath = path.resolve("./input");
fileDisplay(filePath);

//file traversal
function fileDisplay(filePath){
  //read file according to its path and return the file list
  fs.readdir(filePath, (err, files) => {
    //traverse the file list
    files.forEach(filename => {
      console.log("file name:", filename);
      //get abs path of current file
      const filedir = path.join(filePath, filename);
      console.log("file path:", filename);
      if(filename.indexOf('DS_Store') === -1) execJpg(filedir, `${filePath}\\images\\${filename.split('.')[0]}.jpg`)
    })
  })
}

//encode time to 00:00:00
//while t var < length of video

function execJpg(pathFile, saveFilePath){
  // -ss seeks to position
  // -t is duration
  // -i is input
  // -n does not overwrite existing file
  // -s is size
  // -an disables audio stream; images dont need audio data lol
  const command = `ffmpeg -ss 00:00:00 -t 00:00:01 -i ${pathFile} -an -f image2 -s 640:1136 ${saveFilePath}`;
  child.exec(command, (error, response) => {
    console.log('Result:', JSON.stringify(response));
    console.log(saveFilePath, "success...");
  })
}