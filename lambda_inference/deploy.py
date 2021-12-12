#!tutorial_venv/bin/python

import subprocess
import boto3
import yaml
import shlex
import os
import inspect
import shutil

# Move to file dir
current_filename = inspect.getframeinfo(inspect.currentframe()).filename
current_path = os.path.dirname(os.path.abspath(current_filename))

# Get model buckets to upload
os.chdir(current_path)
taskcat_config = yaml.safe_load(open("src/lambda/.taskcat.yml").read())
model_bucket = taskcat_config["project"]["parameters"]["S3BucketModel"]
model_key = taskcat_config["project"]["parameters"]["S3PathModel"]
local_model_path = "src/model/model.onnx"

# Upload model
s3_client = boto3.client("s3")
print(f"Start uploading model")
s3_client.upload_fileobj(
    open(local_model_path, "rb"),
    model_bucket,
    model_key
)
print(f"Finished uploading model to {model_bucket}/{model_key}")

# Add class map to lambda fn
shutil.copy("src/model/class_map.json", "src/lambda/lambda_functions/source/object_detection/")
