import dotenv from 'dotenv'
import Replicate from 'replicate';
import fs from 'fs'

dotenv.config()
const apiKey = process.env.REPLICATE_API_TOKEN
const replicate = new Replicate({
    auth: apiKey,
})
let image;

fs.readFile('../image-embedder/superman.jpg', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    image = data
})

const input = {
    'input': 'guacamole sauce',
    'modality': "text"
};

const embedding = await replicate.run(
    "daanelson/imagebind:0383f62e173dc821ec52663ed22a076d9c970549c209666ac3db181618b7a304", {
        input: {
            input
        }
    }
);

console.log(embedding)



