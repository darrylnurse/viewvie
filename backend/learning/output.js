const ffmpeg = require("fluent-ffmpeg");

const path = "C:\\Users\\Darst\\WebstormProjects\\viewvie\\backend\\input\\test.mp4";

// ffmpeg(path)
//   .output("testout.avi")
//   .size('200x200')
//   .run();

ffmpeg(path)
    .ffprobe((err, metadata) => {
      if(err) console.error("Error:", err)
      else console.log(metadata.format.duration)
    });
