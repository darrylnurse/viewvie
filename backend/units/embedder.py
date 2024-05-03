# final result must be printed
# pip install mediapipe
# pip install opencv-python

import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import cv2
import sys
import json
import os

image = sys.argv[1]
# print(image)

def embed_image(image_path):
    BaseOptions = mp.tasks.BaseOptions
    ImageEmbedder = mp.tasks.vision.ImageEmbedder
    ImageEmbedderOptions = mp.tasks.vision.ImageEmbedderOptions
    VisionRunningMode = mp.tasks.vision.RunningMode

    # Load the image
    image = cv2.imread(str(image_path))
    if image is None:
        print("Error: Unable to load image.")
        return None

    # Convert image to RGB
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Create a MediaPipe Image object
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image_rgb)

    # Evaluate absolute path to model
    current_dir = os.path.dirname(__file__)
    model_dir = os.path.join(current_dir, 'embedder-model')
    model_filename = 'mobilenet_v3_small_075_224_embedder.tflite'
    model_path = os.path.join(model_dir, model_filename)

    # Define options for ImageEmbedder
    options = ImageEmbedderOptions(
        base_options=BaseOptions(model_asset_path=model_path),
        quantize=False,
        running_mode=VisionRunningMode.IMAGE)

    # Create ImageEmbedder instance
    with ImageEmbedder.create_from_options(options) as embedder:
        embedding = embedder.embed(mp_image)

    return embedding.embeddings[0].embedding

embed_list = embed_image(image).tolist()
json_list = json.dumps(embed_list)
print(json_list)