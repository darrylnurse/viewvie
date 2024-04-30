//it seems there are two ways to use ffmpeg
//1. using fluent with abstracted commands
//2. spawning child processes to indirectly execute cli commands

//using commonJs
const ffmpeg = require('fluent-ffmpeg');

function incrementTime(start = '00:00:00:000', duration = '00:00:00:000') {
  const formatAsNumber = (timeString = "00:00:00.000") => {
    return timeString //needs to be a number we can add to another value
        .replace('.', ':')
        .split(':')
        .join(''); // -> 000000000
  }

  const addDuration = (timeString = '000000000', duration = 0) => { //input -> '000000000'
    let timeObj = {
      hours: Number(timeString.slice(0, 2)),
      minutes: Number(timeString.slice(2, 4)),
      seconds: Number(timeString.slice(4, 6)),
      milliseconds: Number(timeString.slice(6)),
    };

    timeObj.milliseconds += duration;
    timeObj.seconds += Math.floor(timeObj.milliseconds / 1000);
    timeObj.milliseconds %= 1000;
    timeObj.minutes += Math.floor(timeObj.seconds / 60);
    timeObj.seconds %= 60;
    timeObj.hours += Math.floor(timeObj.minutes / 60);
    timeObj.minutes %= 60;

    let hours = String(timeObj.hours).padStart(2, '0');
    let minutes = String(timeObj.minutes).padStart(2, '0');
    let seconds = String(timeObj.seconds).padStart(2, '0');
    let milliseconds = String(timeObj.milliseconds).padStart(3, '0');

    return hours + minutes + seconds + milliseconds;
  }

  const formatAsTime = (valueString = "000000000") => { //9 zeroes
    let timeOutput = "";
    const format = string => {
      if (string.length === 3) {
        timeOutput = timeOutput.slice(0, timeOutput.length - 1);
        timeOutput += '.' + string;
        return;
      }
      timeOutput += string.slice(0, 2) + ':';
      format(string.slice(2));
    }
    format(valueString);
    return timeOutput; // -> '00:00:00.000'
  }

  let startNumber = formatAsNumber(start); // 00:00:00:000 -> 000000000
  let addedStart = addDuration(startNumber, Number(formatAsNumber(duration))); //000000000 + X (duration)
  return formatAsTime(addedStart); //00000000X -> 00:00:00:00X
}

const input = `${process.cwd()}/input/test.mp4`;

// ffmpeg.ffprobe(input, (error, metadata)=> {
//   if(error) console.error("Error occurred:", error);
//   else {
//     videoDuration = metadata.format.duration;
//     videoSize = '' + metadata.streams[0].width + 'x' + metadata.streams[0].height;
//   }
// })

let videoDuration = 0; //in seconds with high precision
let videoResolution = '';
function getVideoMetadata(input){
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(input, (error, metadata) => {
      if(error) reject(error);
      else resolve(metadata);
    })
  })
}

async function processVideo(input){
  try {
    const metadata = await getVideoMetadata(input);
    videoDuration = metadata.format.duration;
    videoResolution = `${metadata.streams[0].width}x${metadata.streams[0].height}`;
  } catch (error){
    console.error("Process failed:", error); //go error handling !
  }
}

let start = '00:00:00.000'; //changes within loop
const duration = '00:00:00.033' //does not change

function execSplit(resolution = '0x0'){
    ffmpeg(input) //new ffmpeg instance from input file
        .native() //retain native framerate
        .outputOptions([
            '-vf', `fps=1/${0.033}`
        ])
        .output(`${process.cwd()}/output/frame_%d.jpg`) //format to include the name of input
        // .seek(start)
        // .duration(duration) //at 30fps, each frame is about 33.33 ms
        .size(resolution) //width x height
        .on('error', err => console.log("Didnt't work: ", err.message))
        .on('end', () => console.log("Worked! Done!"))
        .run();
    // start = incrementTime(start, duration);
}

processVideo(input).then(() => { //gotta make it async or else the following code will process with incorrect input
  console.log(videoDuration);
  execSplit(videoResolution);
})




