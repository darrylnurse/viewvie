const chokidar = require('chokidar');
const EventEmitter = require('events').EventEmitter;
const embed = require('./spawn-embedder.js');
const formatVector = require("./format-vector");

function emitterSpawner(directory, name, metadataTitle) { // exports emitter spawner so events here can trigger upsertion
  const emitter = new EventEmitter();

  // we watch this directory to be dynamic
  // we will have two emitters, for user-output and admin-output with two different path

  const watcher = chokidar.watch(directory, {
    ignored: /(^|[\/\\])\../, //ignores hidden files
    persistent: true //watching continuously 👁️
  });
  let embeddingPromises = [];

  function handleAdd(path) { //this function is called on each new image that is added to the directory
    if(name === 'admin') {
      const embedPromise = embed(path)
          .then(embedding => {
            const formattedEmbedding = formatVector(embedding, metadataTitle);
            if (formattedEmbedding) emitter.emit('newEmbedding', formattedEmbedding); //result of embedding is passed to emitter which emits a signal to trigger an event
            return formattedEmbedding;
          })
          .catch(error => {
            console.error('Embedding error:', error);
            return null;
          });

      embeddingPromises.push(embedPromise);
    } else {
      embed(path)
          .then(embedding => emitter.emit('newEmbedding', embedding)) //result of embedding is passed to emitter which emits a signal to trigger an event
          .catch(error => console.error('Embedding error:', error));
    }
  }

  watcher.on('add', handleAdd); //runs function on new items in directory
  watcher.on('error', error => console.error('Error watching files:', error));
  watcher.on('ready', () => {
    if(name === "admin") {
      Promise.all(embeddingPromises).then(() => {
        emitter.emit('finished');
      });
    } else console.log("All user files read.");
  });

  return emitter;
}

module.exports = emitterSpawner;



