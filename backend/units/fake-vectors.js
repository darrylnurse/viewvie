// this unit is used for testing

// fakeEmbedding = 0.000121021 -> 9 digits

const randomDigit = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

function createEmbeddings(amount = 1, precision = 5) {
  let embeddings = new Array(amount).fill(0);

  for (let i = 0; i < amount; i++) {
    let embedding = "0."
    for (let i = 0; i < precision; i++) {
      embedding += String(randomDigit(0, 10)); //max is non-inclusive, we want to generate digits
    }
    embedding = embedding.slice(0, embedding.length - 1) + String(randomDigit(1,10)); //make sure end is not 0!
    embeddings[i] = Number(embedding);
  }
  return embeddings;
}

function createVectors(amount = 1, dimension = 5){
  let vectors = [];
  for(let i = 0; i < amount; i++){
    vectors.push(createEmbeddings(dimension, 9));
  }
  return vectors;
}

// console.log(createVectors(10, 10));

function createId(idLength = 5){
  let id = "";
  for(let i = 0; i < idLength; i++){
    id += String.fromCharCode(randomDigit(97, 123))
  }
  return id;
}

// map each embedding to an object with id and metadata :)
function createVectorObjects(amount = 1, dimension = 5, metadataKey = "", metadataValue = "") {
  const fullVector = createVectors(amount, dimension);
  let vectorObjects = [];
  fullVector.forEach(vector => {
    vectorObjects.push({
      "id": createId(),
      "values": vector,
      "metadata": {
        [metadataKey]: metadataValue
      }
    })
  })
  return vectorObjects;
}

module.exports = createVectorObjects;

// console.log(createVectorObjects(10, 10, "movie_title", "Pacific Rim"));
// -> {
//     id: 'rhfjo',
//     values: [
//       0.136983598, 0.456777403,
//       0.403676397, 0.000897608,
//       0.834375369, 0.933429965,
//       0.761533251, 0.349938657,
//       0.558053585, 0.322971444
//     ],
//     metadata: { movie_title: 'Pacific Rim' }
//   },