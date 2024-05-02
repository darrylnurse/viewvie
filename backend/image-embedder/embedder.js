import puppeteer from 'puppeteer';
import { ImageEmbedder, FilesetResolver } from "@mediapipe/tasks-vision";
async function processImageWithMediapipe(imagePath) {
    // Launch a headless browser instance
    const browser = await puppeteer.launch();

    // Create a new page in the browser
    const page = await browser.newPage();

    // Navigate to a blank page
    await page.goto('about:blank');

    // Load the image file into the page
    await page.evaluate((path) => {
        const img = new Image();
        img.src = path;
        document.body.appendChild(img);
    }, imagePath);

    // Process the image with Mediapipe
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    const imageEmbedder = await ImageEmbedder.createFromOptions(
        vision,
        {
            baseOptions: {
                modelAssetPath: "../image-embedder/mobilenet_v3_large.tflite"
            },
            quantize: true
        });

    const imageEmbedding = await page.evaluate(() => {
        // Use Mediapipe inside the browser context
        // Access the image, process it, and get the embedding
        // Return the result
    });

    // Close the headless browser
    await browser.close();

    return imageEmbedding;
}

// Example usage
const imagePath = '../image-embedder/superman.jpg';
processImageWithMediapipe(imagePath)
    .then(embedding => {
        console.log('Image embedding:', embedding);
    })
    .catch(error => {
        console.error('Error:', error);
    });