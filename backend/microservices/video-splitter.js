//it seems there are two ways to use ffmpeg
//1. using fluent with abstracted commands
//2. spawning child processes to indirectly execute cli commands

//using commonJs
const ffmpeg = require('fluent-ffmpeg');
const input = `${process.cwd()}/input/barremove.png`;
const inputPrefix = getPrefix(input);

function getPrefix(filePath = "/name.type"){
  const leftCut = filePath.lastIndexOf('/');
  const rightCut = filePath.indexOf('.');
  return filePath.slice(leftCut + 1, rightCut);
}

let videoResolution = '';
let videoDuration = 0;
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
// const FPS = 30; //frames per second

function execSplit(resolution = '0x0'){

  ffmpeg(input) //new ffmpeg instance from input file
      .outputOptions([
          '-vf', //allows you to chain video filters
          // `fps=fps=1/${FRAMERATE},scale=${resolution},cropdetect=24:16:0`
          `fps=1/${FRAMERATE}`, //this is the deprecated version, but it outputs 2 more frames?
          `-s ${resolution}`, //-s denotes the resolution: 'widthxheight'
          // '-frames:v', `${Math.floor(videoDuration * FPS)}`
          // deprecated version is more precise, so we will be using it
      ])
      .output(`${process.cwd()}/output/${inputPrefix}-frame-%d.jpg`) //hyphens are word separators, underscores are word joiners
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

function splitVideo(input = '/video/path.mp4') {
  processVideo(input).then(() => { //gotta make it async or else the following code will process with incorrect input
    const newResolution = scaleDown(videoResolution, 4); //scale down by four :)
    // execSplit(newResolution);
    execSplit('512x512');
  });
}

// splitVideo(input);

module.exports = splitVideo;


// running this program multiple times without clearing uploads files will overwrite the image (given the file name is the same)

// run in PowerShell from 'backend' dir to clear uploads images from 'uploads' dir:
// Remove-Item -Path '.\uploads\*' -Recurse




