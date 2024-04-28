import chokidar from 'chokidar';
import { EventEmitter } from 'events';

const emitter = new EventEmitter();

const directory = './output';

const watcher = chokidar.watch(directory, {
  ignored: /(^|[\/\\])\../, //ignores hidden files
  persistent: true, //watching continuously 👁️
});

// embedding function that is called on each image
// input type is a path to an image
// embedding function is async
async function embed(path) { //fake function
  // Simulate embedding processing
  return `embedding-${path}`;
}

function handleAdd(path) { //this function is called on each new image that is added to the directory
  embed(path)
      .then(embedding => emitter.emit('newEmbedding', embedding)) //result of embedding is passed to emitter which emits a signal to trigger an event
      .then(() => console.log("Added to", path))
      .catch(error => console.error('Embedding error:', error));
}

watcher.on('add', handleAdd); //runs function on new items in directory
watcher.on('error', error => console.error(error));
watcher.on('ready', () => console.log('All files read.')); //watches continuously, and logs this message when all is already watched

export default emitter; // exports emitter so events here can trigger upsertion in pinecone.js



