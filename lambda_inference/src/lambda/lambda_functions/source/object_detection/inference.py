from typing import List, Tuple
import boto3
from onnxruntime import InferenceSession
from PIL import Image
import base64 
import numpy as np
import os
import json
from io import BytesIO

"""
The function needs the following environment variables:
    BLOG_TUTORIAL_INFERENCE_MODEL: Bucket name of the model
    BLOG_TUTORIAL_INFERENCE_BUCKET: Bucket path of the model
    BLOG_TUTORIAL_CLASS_MAP: String encoded JSON
    [Optional] BLOG_TUTORIAL_DETECTION_THRESHOLD: Float. Defaults to 0.5

"""

def resize_and_pad(img: Image.Image, image_size:int)->Tuple[np.ndarray, float, List[int]]:
    resize_factor = min(image_size/img.width, image_size/img.height)
    
    if img.width > img.height:
        resize_target = (image_size, int(img.height*resize_factor))
    else:
        resize_target = (int(img.width*resize_factor), image_size)
        
    img = img.resize(resize_target, resample=0)

    if img.width == image_size:
        padded_pixel = image_size - img.height            
    else:
        padded_pixel = image_size - img.width 
        
    if padded_pixel%2 != 0:
        pad_1 = (padded_pixel-1)//2
        pad_2 = pad_1+1
    else:
        pad_1 = padded_pixel//2
        pad_2 = pad_1
        
    if img.width == image_size:
        img = np.array(img)
        img = np.pad(img, [[pad_1, pad_2], [0, 0], [0, 0]], constant_values=0)
        paddings = [pad_1+pad_2, 0]
    else:
        img = np.array(img)
        img = np.pad(img, [[0, 0], [pad_1, pad_2], [0, 0]], constant_values=0)
        paddings = [0, pad_1+pad_2]

    return img, resize_factor, paddings

def normalize(img: np.ndarray, mean:List[float]=[0.485, 0.456, 0.406],
                std: List[float]=[0.229, 0.224, 0.225],
                max_pixel_value:float = 255.)->np.ndarray:
    
    # Based on albumations normalize
    img = np.stack([
                (img[:, :, 0]-mean[0]* max_pixel_value) /(std[0]* max_pixel_value),
                (img[:, :, 1]-mean[1]* max_pixel_value) /(std[1]* max_pixel_value),
                (img[:, :, 2]-mean[2]* max_pixel_value) /(std[2]* max_pixel_value),
            ], axis=-1)
    
    return img

def convert_to_pytorch_input(img: np.ndarray)->np.ndarray:
    # Add batch dimension
    img = np.expand_dims(img, 0)
    # Transpose to pytroch format
    img = np.transpose(img, [0, 3, 1, 2])
    
    return img.astype(np.float32)

def resize_bboxes(resize_factor: float, paddings: List[int], bbox: List[int])-> List[int]:
    # Expects bbox in [x1, y1, x2, y2]
    # Outputs bbox in [x1, y1, x2, y2]
    
    bbox =  [

                (bbox[0]-paddings[0]/2)/resize_factor,
                (bbox[1]-paddings[1]/2)/resize_factor,
                (bbox[2]-paddings[0]/2)/resize_factor,
                (bbox[3]-paddings[1]/2)/resize_factor
            ]

    return bbox

def download_model()->Tuple[dict, os.PathLike]:

    s3_model_path = os.environ["BLOG_TUTORIAL_INFERENCE_BUCKET"]
    model_path = os.path.join("/tmp", os.path.basename(s3_model_path))

    s3 = boto3.client('s3')
    with open(model_path, 'wb') as f:
        s3.download_fileobj(os.environ["BLOG_TUTORIAL_INFERENCE_MODEL"],
                            s3_model_path, f)
    class_map = json.load(open("class_map.json"))

    return class_map, model_path

# Setup model
class_map, model_path = download_model()

session_instance = InferenceSession(model_path)
input_name = session_instance.get_inputs()[0].name
label_names = [el.name for el in session_instance.get_outputs()]
detection_threshold = float(os.environ.get("BLOG_TUTORIAL_DETECTION_THRESHOLD")) if os.environ.get("BLOG_TUTORIAL_DETECTION_THRESHOLD") else .5
input_image_size = int(os.environ["BLOG_TUTORIAL_INPUT_IMAGE_SIZE"])

def event_handler(event, context):
    """
    Expects this key in the event:

        - image: Base64 encoded string, that contains the image
    """
    print("Begin of lambda execution")

    # Load image
    img = base64.decodebytes(event["image"].encode())
    img = Image.open(BytesIO(img))
    print("Loading image finished")

    # Preprocess
    img, resize_factor, padded_pixel = resize_and_pad(img, input_image_size)
    img = normalize(img)
    img = convert_to_pytorch_input(img)
    print("Preprocessing finished")

    # Run inference
    result = session_instance.run(label_names, {input_name: img})
    
    print(f"Inference result: {result}")

    result_payload = []

    for idx in range(len(result[0])):
        if result[1][idx] >= .5:
            result_payload.append(
                {
                "bbox": resize_bboxes(resize_factor, padded_pixel, result[0][idx]),
                "score": result[1][idx],
                "label": class_map[result[2][idx]]
                }
            )
            
    
    return json.dumps(result_payload).encode()
