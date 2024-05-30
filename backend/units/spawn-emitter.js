const chokidar = require('chokidar');
const EventEmitter = require('events').EventEmitter;
// const cloudEmbed = require('./google-embedder');
const replicateEmbed = require('./imagebind-embedder.js');

function emitterSpawner(directory, name) { // exports emitter spawner so events here can trigger upsertion
  const emitter = new EventEmitter();

  // we watch this directory to be dynamic
  // we will have two emitters, for user-output and admin-output with two different path

  const watcher = chokidar.watch(directory, {
    ignored: /(^|[\/\\])\../, //ignores hidden files
    persistent: true //watching continuously 👁️
  });

  let activeEmbeddings = 0;
  function handleAdd(path) { //this function is called on each new image that is added to the directory
    activeEmbeddings++;
    replicateEmbed(path)
        .then(embedding => {
          console.log("Embedding...");
          if (embedding) emitter.emit(`new-${name}-embedding`, embedding);
          activeEmbeddings--;
          checkIfFinished();
        })
        .catch(error => {
          console.error('Embedding error:', error);
          activeEmbeddings--;
          checkIfFinished();
        });
  }

  watcher.on('add', handleAdd); //runs function on new items in directory
  watcher.on('error', error => console.error('Error watching files:', error));
  const checkIfFinished = () => {
    if (activeEmbeddings === 0) {
      emitter.emit(`${name}-finished`);
      console.log(`${name} embeddings complete.`);
    }
  }

  process.on('exit', () => {
    watcher.close().catch(console.error);
    emitter.removeAllListeners();
  });

  return emitter;
}

module.exports = emitterSpawner;



