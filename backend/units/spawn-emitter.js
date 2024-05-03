const chokidar = require('chokidar');
const EventEmitter = require('events').EventEmitter;
const embed = require('./spawn-embedder.js');

function emitterSpawner(directory, name) { // exports emitter spawner so events here can trigger upsertion in pinecone.js
  const emitter = new EventEmitter();

  // we watch this directory to be dynamic
  // we will have two emitters, for user-output and admin-output with two different paths

  const watcher = chokidar.watch(directory, {
    ignored: /(^|[\/\\])\../, //ignores hidden files
    persistent: true, //watching continuously 👁️
  });

  // embedding function that is called on each image
  // input type is a path to an image
  // embedding function is async
  function handleAdd(path) { //this function is called on each new image that is added to the directory
    embed(path)
        .then(embedding => emitter.emit('newEmbedding', embedding)) //result of embedding is passed to emitter which emits a signal to trigger an event
        .catch(error => console.error('Embedding error:', error));
  }

  watcher.on('add', handleAdd); //runs function on new items in directory
  watcher.on('error', error => console.error(error));
  watcher.on('ready', () => console.log(`All ${name} files read.`)); //watches continuously, and logs this message when all is already watched

  return emitter;
}

module.exports = emitterSpawner;



