const fs = require('fs').promises;

async function resetDirectory(directory, filename) {
  try {
    await fs.rm(directory, { recursive: true });

    await fs.mkdir(directory, { recursive: true });

    const filePath = `${directory}/${filename}`;
    await fs.writeFile(filePath, filename);
  } catch (err) {
    console.error(`Error processing directory and file: ${err}`);
  }
}

async function purgeDirectory(){
  resetDirectory("./backend/admin-output", ".gitkeep").catch(console.error);
  resetDirectory("./backend/user-output", ".gitkeep").catch(console.error);
  resetDirectory("./backend/uploads", ".gitkeep").catch(console.error);
  console.log("Directories purged.");
}

module.exports = purgeDirectory;

