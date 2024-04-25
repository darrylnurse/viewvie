//use to test if ffmpeg is installed correctly

const { exec } = require('child_process');

exec('ffmpeg -version', (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: \n${stdout}`);
});
