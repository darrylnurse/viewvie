//it seems there are two ways to use ffmpeg
//1. using fluent with abstracted commands
//2. spawning child processes to indirectly execute cli commands

//using commonJs
const ffmpeg = require('fluent-ffmpeg');
const {join} = require("path");

let videoResolution = '';

function getVideoMetadata(input){
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(input, (error, metadata) => { //this method is asynchronous; promise wrapping ensures its accessible
      if(error) reject(error);
      else resolve(metadata);
    })
  })
}

async function processVideo(input){
  try {
    const metadata = await getVideoMetadata(input);
    videoResolution = `${metadata.streams[0].width}x${metadata.streams[0].height}`; //we can compress here
  } catch (error){
    console.error("Process failed:", error); //go error handling !
  }
}

const FRAMERATE = 0.033; //in milliseconds
const FPS = 30; //frames per second

function getPrefix(filePath = "/name.type"){
  while(filePath.startsWith('.')) filePath = filePath.slice(1);
  const leftCut = filePath.lastIndexOf('/');
  const rightCut = filePath.indexOf('.');
  return filePath.slice(leftCut + 1, rightCut);
}

function execSplit(input, output, resolution = '0x0'){
  const inputPrefix = getPrefix(input);
  const outputPath = join(__dirname, '..', output.toString(), `${inputPrefix}-frame-%d.jpg`);

  ffmpeg(input) //new ffmpeg instance from input file
      .outputOptions([
          '-vf', //allows you to chain video filters
          `fps=1/${FRAMERATE},scale=${resolution}`, //scale denotes the resolution: 'widthxheight'
      ])
      .output(outputPath) //hyphens are word separators, underscores are word joiners
      .on('error', err => console.log("Didn't work: ", err.message))
      .on('end', () => console.log("Video split successfully!"))
      .run(); //starts processing
}

//scale down function
//get resolution of original video and apply scale down function
function scaleDown(resolution = '0x0', scale = 1){ //resolution is width x height
  let times = resolution.toLowerCase().indexOf('x');
  let width = resolution.slice(0, times);
  let height = resolution.slice(times + 1);
  return `${Math.floor(width/scale)}x${Math.floor(height/scale)}`;
}

function splitVideo(input = '/video/path.mp4', output = '/frame/output/path/') {
  processVideo(input).then(() => { //gotta make it async or else the following code will process with incorrect input
    const newResolution = scaleDown(videoResolution, 4); //scale down by four :)
    execSplit(input, output, newResolution);
  });
}

// splitVideo("./input/barremove.png", "./admin/output/");
// works when i am in microservices directory ?? but not in backend
// fixed methinks

module.exports = splitVideo;

// running this program multiple times without clearing output files will overwrite the image (given the file name is the same)
// run in PowerShell from 'backend' dir to clear output images from 'output' dir:
// Remove-Item -Path '.\output\*' -Recurse




