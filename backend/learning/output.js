const ffmpeg = require("fluent-ffmpeg");

const path = "C:\\Users\\Darst\\WebstormProjects\\viewvie\\backend\\input\\test.mp4";

// ffmpeg(path)
<<<<<<< HEAD
//   .uploads("testout.avi")
=======
//   .output("testout.avi")
>>>>>>> d5d0cfd8aa8e310df2aae089b7702bfea2b55445
//   .size('200x200')
//   .run();

ffmpeg(path)
    .ffprobe((err, metadata) => {
      if(err) console.error("Error:", err)
      else console.log(metadata.format.duration)
    });
