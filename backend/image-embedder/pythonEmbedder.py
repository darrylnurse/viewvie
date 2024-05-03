import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import cv2
import numpy as np


def embed_image(image_path):
    BaseOptions = mp.tasks.BaseOptions
    ImageEmbedder = mp.tasks.vision.ImageEmbedder
    ImageEmbedderOptions = mp.tasks.vision.ImageEmbedderOptions
    VisionRunningMode = mp.tasks.vision.RunningMode

    # Load the image
    image = cv2.imread(image_path)
    if image is None:
        print("Error: Unable to load image.")
        return None

    # Convert image to RGB
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Create a MediaPipe Image object
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image_rgb)

    # Define options for ImageEmbedder
    options = ImageEmbedderOptions(
        base_options=BaseOptions(model_asset_path='mobilenet_v3_small.tflite'),
        quantize=True,
        running_mode=VisionRunningMode.IMAGE)

    # Create ImageEmbedder instance
    with ImageEmbedder.create_from_options(options) as embedder:
        embedding = embedder.embed(mp_image)

    print(embedding)
    return embedding

