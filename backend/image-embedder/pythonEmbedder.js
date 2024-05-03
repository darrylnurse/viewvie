import {spawn, spawnSync} from 'child_process'
import fs from 'fs'

const pythonEmbedder = 'C:/Users/Cooln/Viewvie/viewvie/backend/image-embedder/pythonEmbedder.py'
const pythonTest = 'C:/Users/Cooln/Viewvie/viewvie/backend/image-embedder/test.py'

let image;

fs.readFile('../image-embedder/images/superman.jpg', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    image = data;
})

const args = [image]

const pythonProcess = spawn('python', [pythonEmbedder, ...args])

pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
});

pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
});

pythonProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
})


