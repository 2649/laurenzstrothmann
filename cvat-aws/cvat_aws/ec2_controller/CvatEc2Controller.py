from aws_cdk import (
    aws_ec2 as ec2,
    aws_events as events,
    aws_events_targets as targets,
    aws_lambda as function,
    aws_iam as iam,
    aws_logs as logs,
    aws_ssm as ssm,
    Stack,
)
from constructs import Construct
from ..Config import CvatConfig


class CvatEc2Controller(Stack):
    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        instance: ec2.Instance,
        config: CvatConfig,
        **kwargs,
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        self.ami_parameter = ssm.StringListParameter(
            self, "CVAT-AMI-Backups", string_list_value=["", ""]
        )

        self.lambda_role = iam.Role(
            self,
            "lambda_cvat_role",
            assumed_by=iam.ServicePrincipal("lambda.amazonaws.com"),
        )
        self.lambda_role.add_managed_policy(
            iam.ManagedPolicy.from_aws_managed_policy_name(
                "service-role/AWSLambdaBasicExecutionRole"
            )
        )
        self.lambda_fn = function.Function(
            self,
            "Backup-and-sleep-fn",
            code=function.Code.from_asset("cvat_aws/ec2_controller/src"),
            memory_size=256,
            handler="handler.event_handler",
            log_retention=logs.RetentionDays.ONE_MONTH,
            runtime=function.Runtime.PYTHON_3_8,
            environment={
                "CVAT_INSTANCE_ID": instance.instance_id,
                "CVAT_AMI_NAME": "CVAT_BACKUP_AMI",
                "CVAT_AMI_SSM_PARAM": self.ami_parameter.parameter_name,
            },
        )

        self.ami_parameter.grant_read(self.lambda_fn)
        self.ami_parameter.grant_write(self.lambda_fn)
        self.lambda_fn.add_to_role_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                resources=[
                    f"arn:aws:ec2:*:{self.account}:instance/{instance.instance_id}",
                    f"arn:aws:ec2:{config.region}::image/*",
                    f"arn:aws:ec2:{config.region}::snapshot/*",
                ],
                actions=[
                    "ec2:StartInstances",
                    "ec2:StopInstances",
                    "ec2:DeregisterImage",
                    "ec2:CreateImage",
                    "ec2:DescribeInstanceStatus",
                ],
            )
        )

        self.lambda_fn.add_to_role_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                resources=[
                    "*",
                ],
                actions=[
                    "ec2:DescribeInstanceStatus",
                ],
            )
        )

        self.backup_event = events.Rule(
            self,
            "Backup-CVAT",
            schedule=events.Schedule.cron(hour="17", minute="00"),
            targets=[
                targets.LambdaFunction(
                    self.lambda_fn,
                    event=events.RuleTargetInput.from_object({"ami": True}),
                )
            ],
        )

        self.stop_event = events.Rule(
            self,
            "stop-CVAT",
            schedule=events.Schedule.cron(hour="17", minute="59"),
            targets=[
                targets.LambdaFunction(
                    self.lambda_fn,
                    event=events.RuleTargetInput.from_object({"stop": True}),
                )
            ],
        )

        self.stop_event = events.Rule(
            self,
            "start-CVAT",
            schedule=events.Schedule.cron(hour="5", minute="1/5"),
            targets=[
                targets.LambdaFunction(
                    self.lambda_fn,
                    event=events.RuleTargetInput.from_object({"start": True}),
                )
            ],
        )
