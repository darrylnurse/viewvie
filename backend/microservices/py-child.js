// doesnt work 😿

const { spawn } = require('child_process');

const pyScript = spawn('py', ['./microservices/embedder.py'], {shell: true});

pyScript.stdout.on('data', data => {
  console.log(`stdout: ${data}`);
});

pyScript.stderr.on('data', err => {
  console.error(`stdout: ${err}`);
});

pyScript.on('close', code => {
  console.log("script exited with code", code);
});

// spawn('echo', ['hello']);

// console.log(process.env.PATH);