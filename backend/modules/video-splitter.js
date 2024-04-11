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

function execSplit(resolution = '0x0', duration = 0.0){
    ffmpeg(input) //new ffmpeg instance from input file
        .outputOptions([
            '-vf', `fps=1/${FRAMERATE}` //this is the deprecated version, but it outputs 2 more frames?
            // '-frames:v', `${Math.floor(videoDuration * FPS)}` //deprecated version is more precise, so we will be using it
        ])
        .output(`${process.cwd()}/output/${inputPrefix}-frame-%d.jpg`) //hyphens are word separators, underscores are word joiners
        .size(resolution) //width x height
        .on('error', err => console.log("Didn't work: ", err.message))
        .on('end', () => console.log("Worked! Done!"))
        .run(); //starts processing
}

processVideo(input).then(() => { //gotta make it async or else the following code will process with incorrect input
  execSplit(videoResolution);
})




