#!/usr/bin/env python3
import os
import aws_cdk as cdk

from cvat_aws.CvatStack import CvatStack
from cvat_aws.CvatDurableInfrastructure import CvatDurableInfrastructure
from cvat_aws.ec2_controller.CvatEc2Controller import CvatEc2Controller
from cvat_aws.Config import CvatConfig

app = cdk.App()

config = CvatConfig(
    os.environ["CVAT_AWS_DOMAIN"],
    os.environ["CVAT_AWS_HZ_ID"],
    os.environ.get("CVAT_INSTANCE_ID", None),
    "eu-central-1",
    block_storage_size=100,
    ec2_type="t2.medium",
    ec2_key=os.environ.get("CVAT_EC2_KEY", None),
)

# Init stack, that exist permanently
durable_stack = CvatDurableInfrastructure(
    app, "CvatDurableInfrastructure", config, termination_protection=True
)

# Stack that can be shut down without any loss of data
cvat_stack = CvatStack(
    scope=app,
    construct_id="CvatStack",
    vpc=durable_stack.vpc,
    hosted_zone=durable_stack.hosted_zone,
    certificate=durable_stack.certificate,
    user_pool=durable_stack.user_pool,
    user_pool_client=durable_stack.user_pool_client,
    user_pool_domain=durable_stack.user_pool_domain,
    config=config,
)

ec2_controller = CvatEc2Controller(
    scope=app,
    construct_id="CvatEc2Controller",
    instance=cvat_stack.instance,
    config=config,
)

app.synth()
