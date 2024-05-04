# actually did process all 500 images

import os
import sys
import json
import math
import base64 # pip install pybase64
from io import BytesIO
from pandas import DataFrame # pip install pandas
from PIL import Image # pip install pillow
from transformers import AutoImageProcessor, ResNetForImageClassification # pip install transformers
# pip install torch torchvision torchaudio

base_directory = sys.argv[1]
all_image_urls = os.listdir(base_directory)[1:]

sample_image_urls = list(map(lambda item: f"{base_directory}/{item}", all_image_urls[:10]))

payloads = DataFrame.from_records({"image_url": sample_image_urls})
payloads["type"] = "frame"

images = list(map(lambda el: Image.open(el), payloads["image_url"]))

target_width = 256

def resize_image(image_url):
    pil_image = Image.open(image_url)
    image_aspect_ratio = pil_image.width / pil_image.height
    resized_pil_image = pil_image.resize(
        [target_width, math.floor(target_width * image_aspect_ratio)]
    )
    return resized_pil_image

def convert_image_to_base64(pil_image):
    image_data = BytesIO()
    pil_image.save(image_data, format="JPEG")
    base64_string = base64.b64encode(image_data.getvalue()).decode("utf-8")

resized_images = list(map(lambda el: resize_image(el), sample_image_urls))
base64_strings = list(map(lambda el: convert_image_to_base64(el), resized_images))
payloads["base64"] = base64_strings

processor = AutoImageProcessor.from_pretrained("microsoft/resnet-50")
model = ResNetForImageClassification.from_pretrained("microsoft/resnet-50")

inputs = processor(
    list(images),
    return_tensors="pt",
)

outputs = model(**inputs)
embeddings = outputs.logits.squeeze()

json_list = json.dumps(embeddings.tolist())
print(json_list)