const path = require('path');
const { PythonShell } = require("python-shell");
const os = require("os");

function executeEmbedder(imagePath) {
  return new Promise((resolve, reject) => {

    // directory containing python executable
    const homeDirectory = os.homedir();
    const pythonExePath = path.join(homeDirectory, 'viewvie', 'Scripts', 'python');
    const pythonScriptPath = path.join(__dirname, '');

    const py_shell_options = {
      mode: 'text', //data is sent and received as is
      pythonPath: pythonExePath,
      pythonOptions: ['-u'], // print results real-time
      scriptPath: pythonScriptPath,
      args: [imagePath],
    };

    let output = [];
    const pyShell = new PythonShell('embedder.py', py_shell_options);

    pyShell.on('message', message => output.push(message));

    pyShell.end(function (error, code) {
      if (error) throw error;
      else if(code === 0) resolve(output);
      else reject(`process exited with error code ${code}.`);
    });

  })
}

async function embed(imagePath){
  try { return await executeEmbedder(imagePath) }
  catch(error) { return new Error(error) }
}

// embed('beggol').then(result => console.log(result));

module.exports = embed;