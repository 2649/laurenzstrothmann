from aws_cdk import (
    aws_ec2 as ec2,
    aws_elasticloadbalancingv2 as alb,
    aws_elasticloadbalancingv2_targets as alb_targets,
    aws_elasticloadbalancingv2_actions as alb_actions,
    aws_certificatemanager as acm,
    aws_s3_assets as assets,
    aws_cognito as cognito,
    aws_route53 as route53,
    aws_route53_targets as targets,
    Stack,
)

from constructs import Construct
from .Config import CvatConfig


class CvatStack(Stack):
    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        vpc: ec2.Vpc,
        hosted_zone: route53.HostedZone,
        user_pool: cognito.UserPool,
        user_pool_client: cognito.UserPoolClient,
        user_pool_domain: cognito.UserPoolDomain,
        certificate: acm.Certificate,
        config: CvatConfig,
        create_EIP: bool = True,
        **kwargs,
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        self.vpc = vpc
        self.hosted_zone = hosted_zone
        self.certificate = certificate
        self.user_pool = user_pool
        self.user_pool_client = user_pool_client
        self.user_pool_domain = user_pool_domain
        self.config = config
        self.create_EIP = create_EIP

        # Create resources
        self.alb = self.get_alb(self.vpc, f"{self.config.domain_name.split('.')[0]}")

        self.instance = self.get_ec2_instance(
            ec2.InstanceType(self.config.ec2_type), self.vpc
        )

        if self.create_EIP:
            self.eip = self.get_EIP(self.instance)

        # Configure resource communication
        self.integrate_resources()

    def integrate_resources(self):
        # Add read access to compose override
        self.compose_override.grant_read(self.instance.role)

        # Connect instance to ALB
        self.cvat_target_group = alb.ApplicationTargetGroup(
            self,
            "CVAT-Targetgroup",
            target_type=alb.TargetType.INSTANCE,
            port=8080,
            vpc=self.vpc,
        )
        self.cvat_target_group.add_target(
            alb_targets.InstanceIdTarget(self.instance.instance_id)
        )

        self.cvat_listener_https = self.alb.add_listener(
            "cvat_listener_https",
            port=443,
        )

        self.cvat_listener_http = self.alb.add_listener(
            "cvat_listener_http",
            port=80,
        )

        self.cvat_listener_https.add_action(
            "cognito-auth-https",
            action=alb_actions.AuthenticateCognitoAction(
                next=alb.ListenerAction.forward(target_groups=[self.cvat_target_group]),
                user_pool=self.user_pool,
                user_pool_client=self.user_pool_client,
                user_pool_domain=self.user_pool_domain,
            ),
        )

        self.cvat_listener_http.add_action(
            "http-to-https-forward",
            action=alb.ListenerAction.redirect(port="443", protocol="HTTPS"),
        )

        # Connect 53 and ALB
        route53.ARecord(
            self,
            "alb-alias-record",
            zone=self.hosted_zone,
            target=route53.RecordTarget.from_alias(
                targets.LoadBalancerTarget(self.alb)
            ),
            record_name="",
        )

        # Create TLS certs
        self.cvat_listener_https.add_certificates(
            "CVAT-Certificate",
            certificates=[self.certificate],
        )

    def get_alb(self, vpc: ec2.Vpc, alb_name: str):
        self.security_group_alb = ec2.SecurityGroup(
            self, "SG_CVAT", vpc=vpc, allow_all_outbound=True
        )
        # HTTPS
        self.security_group_alb.add_ingress_rule(ec2.Peer.any_ipv4(), ec2.Port.tcp(443))
        self.security_group_alb.add_ingress_rule(ec2.Peer.any_ipv4(), ec2.Port.tcp(80))

        return alb.ApplicationLoadBalancer(
            self,
            "CVAT_ALB",
            vpc=vpc,
            internet_facing=True,
            security_group=self.security_group_alb,
            load_balancer_name=alb_name,
        )

    def get_ec2_instance(self, instance_type: ec2.InstanceType, vpc: ec2.Vpc):
        self.security_group_instance = ec2.SecurityGroup(
            self, "SG_ALB_CVAT", vpc=vpc, allow_all_outbound=True
        )
        # SSH
        if self.create_EIP:
            self.security_group_instance.add_ingress_rule(
                ec2.Peer.any_ipv4(), ec2.Port.tcp(22)
            )
        # HTTP
        self.security_group_instance.add_ingress_rule(
            ec2.Peer.any_ipv4(), ec2.Port.tcp(8080)
        )
        if self.config.ami_id:
            ami_id = ec2.MachineImage.generic_linux(
                {self.config.region: self.config.ami_id}
            )
        else:
            ami_id = ec2.MachineImage.from_ssm_parameter(
                "/aws/service/canonical/ubuntu/server/focal/stable/current/amd64/hvm/ebs-gp2/ami-id"  # noqa: E501
            )
        return ec2.Instance(
            self,
            "CVAT_Instance",
            key_name=self.config.ec2_key,
            instance_type=instance_type,
            machine_image=ami_id,
            block_devices=[
                ec2.BlockDevice(
                    device_name="/dev/sda1",
                    volume=ec2.BlockDeviceVolume.ebs(CvatConfig.block_storage_size),
                )
            ],
            user_data=self.get_user_data(),
            vpc=vpc,
            vpc_subnets=ec2.SubnetSelection(subnet_type=ec2.SubnetType.PUBLIC),
            user_data_causes_replacement=True,
            security_group=self.security_group_instance,
        )

    def get_user_data(self):
        self.compose_override = assets.Asset(
            self, "cvat_compose_override", path="./cvat_aws/docker-compose.aws.yml"
        )
        user_data = ec2.UserData.for_linux()

        user_data.add_commands("apt-get update")
        user_data.add_commands(
            "apt-get --no-install-recommends install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common"  # noqa: E501
        )
        user_data.add_commands(
            "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -"
        )
        user_data.add_commands(
            'add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"'  # noqa: E501
        )
        user_data.add_commands("apt-get update")
        user_data.add_commands(
            "apt-get --no-install-recommends install -y docker-ce docker-ce-cli containerd.io"  # noqa: E501
        )
        user_data.add_commands(
            "apt-get --no-install-recommends install -y python3-pip python3-setuptools"
        )
        user_data.add_commands("python3 -m pip install setuptools docker-compose")
        user_data.add_commands("cd /home/ubuntu")
        user_data.add_commands("git clone https://github.com/opencv/cvat")
        user_data.add_commands("cd cvat")
        user_data.add_commands("sudo apt-get install awscli -y")
        user_data.add_s3_download_command(
            bucket=self.compose_override.bucket,
            bucket_key=self.compose_override.s3_object_key,
            local_file="/home/ubuntu/cvat/docker-compose.aws.yml",
        )
        user_data.add_commands(
            f"CVAT_HOST={self.config.domain_name} CVAT_HOST_INTERNAL=localhost CVAT_VERSION=latest docker-compose -f docker-compose.yml -f docker-compose.aws.yml up -d"  # noqa: E501
        )

        return user_data

    def get_EIP(self, ec2_instance: ec2.Instance):
        return ec2.CfnEIP(
            self, "CVAT_EIP", domain="vpc", instance_id=ec2_instance.instance_id
        )
