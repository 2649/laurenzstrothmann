from aws_cdk import (
    aws_ec2 as ec2,
    aws_certificatemanager as acm,
    aws_route53 as route53,
    aws_cognito as cognito,
    Stack,
)
from constructs import Construct
from .Config import CvatConfig


class CvatDurableInfrastructure(Stack):
    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        config: CvatConfig,
        **kwargs,
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        self.vpc = ec2.Vpc(
            self,
            "CVAT_VPC",
            cidr="10.0.0.0/16",
            nat_gateways=0,
        )

        self.hosted_zone = route53.HostedZone.from_hosted_zone_attributes(
            self,
            "Cvat-hosted-zone",
            hosted_zone_id=config.hosted_zone_id,
            zone_name=config.domain_name,
        )

        self.certificate = acm.DnsValidatedCertificate(
            self,
            f"{config.domain_name.split('.')[0]}-Cert",
            hosted_zone=self.hosted_zone,
            cleanup_route53_records=True,
            domain_name=config.domain_name,
        )

        self.user_pool = cognito.UserPool(
            self,
            "CVAT-Userpool",
            account_recovery=cognito.AccountRecovery.EMAIL_ONLY,
            auto_verify=cognito.AutoVerifiedAttrs(email=True, phone=True),
            self_sign_up_enabled=False,
            standard_attributes=cognito.StandardAttributes(
                email=cognito.StandardAttribute(mutable=True, required=True),
                given_name=cognito.StandardAttribute(mutable=True, required=True),
                family_name=cognito.StandardAttribute(mutable=True, required=True),
            ),
        )

        self.user_pool_client = self.user_pool.add_client(
            "alb-app-client",
            user_pool_client_name=config.domain_name.split(".")[0],
            generate_secret=True,
            o_auth=cognito.OAuthSettings(
                callback_urls=[
                    f"https://{config.domain_name}/oauth2/idpresponse",
                    f"https://{config.domain_name}",
                ],
                flows=cognito.OAuthFlows(authorization_code_grant=True),
                scopes=[cognito.OAuthScope.OPENID],
            ),
            supported_identity_providers=[
                cognito.UserPoolClientIdentityProvider.COGNITO
            ],
        )

        self.user_pool_domain = self.user_pool.add_domain(
            "cvat-cognito-auth",
            cognito_domain=cognito.CognitoDomainOptions(
                domain_prefix=config.domain_name.split(".")[0]
            ),
        )
