import os
from venv import create
import boto3
import logging
import sys
import datetime

logging.basicConfig(
    stream=sys.stdout,
    level=logging.INFO,
    format="[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s",
    force=True,
)
logger = logging.getLogger("cvat_lambda_handler")

# Read env
try:
    instance_id = os.environ["CVAT_INSTANCE_ID"]
except KeyError:
    logger.error("No key found for CVAT_INSTANCE_ID. The key is needed!")

try:
    ami_name = os.environ["CVAT_AMI_NAME"]
except KeyError:
    logger.error("No key found for CVAT_AMI_NAME. The key is needed!")

try:
    ssm_ami_param = os.environ["CVAT_AMI_SSM_PARAM"]
except KeyError:
    logger.error("No key found for CVAT_AMI_SSM_PARAM. The key is needed!")


ec2 = boto3.client("ec2")
ssm = boto3.client("ssm")


def event_handler(event: dict, context: dict):
    # Read event
    logger.info(f"Received event: {event}")
    stop = event.get("stop", False)
    start = event.get("start", False)
    create_ami = event.get("ami", False)

    if create_ami:
        logger.info(f"Create AMI event is executed: {create}")
        date = datetime.datetime.now()
        resp = ec2.create_image(
            Description=f"CVAT backup from {date.isoformat()}",
            Name=f"{ami_name}-{date.year}-{date.month}-{date.day}-{date.hour}",
            InstanceId=instance_id,
        )
        logger.info(f"Message from boto: {resp}")
        new_ami_id = resp["ImageId"]
        old_amis = ssm.get_parameter(Name=ssm_ami_param)["Parameter"]["Value"]
        logger.info(f"Got old ami's : {old_amis}. New ami: {new_ami_id}")

        ssm.put_parameter(
            Name=ssm_ami_param,
            Value=f"{new_ami_id},{old_amis.split(',')[0]}",
            Overwrite=True,
        )
        logger.info("Update ssm parameter successfully")

        try:
            ami_to_delete = old_amis.split(",")[-1]
            if len(ami_to_delete) > 0:
                ec2.deregister_image(ImageId=ami_to_delete)
            else:
                logger.info("AMI id is empty")
        except IndexError:
            logger.info("Skipping delete of old ami, because number of ami's < 2")

    if stop:
        logger.info(f"Stop event is executed: {stop}")
        resp = ec2.stop_instances(
            InstanceIds=[instance_id],
        )
        logger.info(f"Message from boto: {resp}")

    if start:
        logger.info(f"Start event is executed: {start}")
        status = ec2.describe_instance_status(
            InstanceIds=[instance_id], IncludeAllInstances=True
        )["InstanceStatuses"][0]["InstanceState"]["Name"]
        logger.info(f"Status of the instance is {status}")
        if status == "stopped":
            resp = ec2.start_instances(
                InstanceIds=[instance_id],
            )
            logger.info(f"Message from boto: {resp}")
        else:
            logger.info(f"Instance will not be started, because it is {status}")
