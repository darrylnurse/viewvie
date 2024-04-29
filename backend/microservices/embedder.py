# doesnt work

# x = 6
# y = 5
#
# #final result must be printed
# print(x + y)

# cant pip install media mediapipe
# also cant take input

def embed(image):
    image += '4'
    print(image)

# import mediapipe as mp
# from mediapipe.tasks import python
# from mediapipe.tasks.python import vision
#
# BaseOptions = mp.tasks.BaseOptions
# ImageEmbedder = mp.tasks.vision.ImageEmbedder
# ImageEmbedderOptions = mp.tasks.vision.ImageEmbedderOptions
# VisionRunningMode = mp.tasks.vision.RunningMode
#
# model_path = "C:/Users/Darst/Downloads/mobilenet_v3_small_075_224_embedder.tflite"
#
# options = ImageEmbedderOptions(
#     base_options=BaseOptions(model_asset_path=model_path),
#     quantize=False,
#     running_mode=VisionRunningMode.IMAGE)
#
# with ImageEmbedder.create_from_options(options) as embedder:
#     mp_image = mp.Image.create_from_file("C:/Users/Darst/OneDrive/Pictures/barremove.png")
#     embedding_result = embedder.embed(mp_image)
#     print(embedding_result)
#
# print('hi')