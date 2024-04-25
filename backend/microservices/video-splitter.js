//it seems there are two ways to use ffmpeg
//1. using fluent with abstracted commands
//2. spawning child processes to indirectly execute cli commands

//using commonJs
const ffmpeg = require('fluent-ffmpeg');
const input = `${process.cwd()}/input/blueink.mp4`;
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
    videoDuration = metadata.format.duration;
  } catch (error){
    console.error("Process failed:", error); //go error handling !
  }
}

const FRAMERATE = 0.033; //in milliseconds
// const FPS = 30; //frames per second

function execSplit(resolution = '0x0'){
    ffmpeg(input) //new ffmpeg instance from input file
        .outputOptions([ //-s denotes the resolution: 'widthxheight'
            '-vf', `fps=1/${FRAMERATE}`, `-s ${resolution}` //this is the deprecated version, but it outputs 2 more frames?
            // '-frames:v', `${Math.floor(videoDuration * FPS)}` //deprecated version is more precise, so we will be using it
        ])
        .output(`${process.cwd()}/output/${inputPrefix}-frame-%d.jpg`) //hyphens are word separators, underscores are word joiners
        .on('error', err => console.log("Didn't work: ", err.message))
        .on('end', () => console.log("Worked! Done!"))
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

processVideo(input).then(() => { //gotta make it async or else the following code will process with incorrect input
  const newResolution = scaleDown(videoResolution, 4); //scale down by four :)
  execSplit(newResolution);
})

// running this program multiple times without clearing output files will overwrite the image (given the file name is the same)

// run in PowerShell from 'backend' dir to clear output images from 'output' dir:
// Remove-Item -Path '.\output\*' -Recurse



