const Replicate = require("replicate");
const dotenv = require("dotenv");
const { readFile } = require("node:fs/promises");

dotenv.config();

const replicate = new Replicate({auth: process.env.REPLICATE_API_TOKEN});

async function replicateEmbed(imagePath) {
  const data = (await readFile(imagePath)).toString("base64");
  const image = `data:application/octet-stream;base64,${data}`;

  const input = {
    input: image
  };

 return await replicate.run("daanelson/imagebind:0383f62e173dc821ec52663ed22a076d9c970549c209666ac3db181618b7a304", {input});
}

module.exports = replicateEmbed;