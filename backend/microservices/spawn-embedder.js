// kinda work 😿
// just missing python embedder

const { spawn } = require('child_process');

function embedImage(path) {
  return new Promise((resolve, reject) => {
    const pythonCommand = `import sys; sys.path.append('.'); from embedder import embed; embed('${path}')`;
    const result = spawn('python', ['-c', pythonCommand]);

    let output = '';

    result.stdout.on('data', data => output += data.toString());
    result.stderr.on('data', data => new Error(data.toString()));
    result.on('close', (code) => {
      if (code === 0) resolve(output.trim());
      else reject(`Child process exited with error code ${code}`);
    });
  });
}

async function embed(imagePath) {
  try {return await embedImage(imagePath)}
  catch (error) {return new Error(error)}
}

//embed("beggol").then(result => console.log(result));

module.exports = embed;


