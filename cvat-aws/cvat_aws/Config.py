from dataclasses import dataclass


@dataclass(frozen=True)
class CvatConfig:
    domain_name: str
    hosted_zone_id: str
    ami_id: str = None
    region: str = "eu-central-1"
    block_storage_size: int = 100
    ec2_type: str = "t2.medium"
    ec2_key: str = None
