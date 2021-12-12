import base64
from PIL import Image
import os
import yaml
import pytest
import inspect

cureent_filename = inspect.getframeinfo(inspect.currentframe()).filename
current_path = os.path.dirname(os.path.abspath(cureent_filename))

@pytest.fixture(scope="function")
def create_env_variables():

    os.chdir(current_path)
    taskcat_config = yaml.safe_load(open("../../../.taskcat.yml").read())
    model_bucket = taskcat_config["project"]["parameters"]["S3BucketModel"]
    model_key = taskcat_config["project"]["parameters"]["S3PathModel"]

    os.environ["BLOG_TUTORIAL_INFERENCE_MODEL"] = model_bucket
    os.environ["BLOG_TUTORIAL_INFERENCE_BUCKET"] = model_key
    os.environ["BLOG_TUTORIAL_DETECTION_THRESHOLD"] = "0.5"
    os.environ["BLOG_TUTORIAL_INPUT_IMAGE_SIZE"] = "384"

@pytest.fixture(scope="function")
def load_image():
    img_bytes = open("fridge-refrigerator-open-door.jpg", "rb").read()
    return base64.encodebytes(img_bytes).decode()


def test_inference_lambda(create_env_variables, load_image):
    # Load lambda function (cold start)
    from inference import event_handler

    assert callable(event_handler)

    # Call lambda function
    lambda_response = event_handler({
                            "image": load_image
                        }, {})
