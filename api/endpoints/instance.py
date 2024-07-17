# api/endpoints/instance.py
import boto3
from fastapi import HTTPException, APIRouter
from pydantic import BaseModel
from typing import List
import logging
from fastapi.responses import JSONResponse

router = APIRouter()

ec2 = boto3.client('ec2', region_name='eu-west-1')


class Instance(BaseModel):
    instance_name: str
    region_name: str
    image_id: str
    instance_type: str
    security_group_id: str


class InstanceDetails(BaseModel):
    instance_id: str
    instance_name: str
    subnet_id: str
    availability_zone: str
    launch_time: str
    status: str


@router.get("/stop-instance/{instance_id}/{region}")
def stop_instance(instance_id: str, region: str):

    try:
        ec2_client = boto3.client('ec2', region_name=region)
        response = ec2_client.stop_instances(
            InstanceIds=[instance_id],
        )

        # Check if the stopping operation was successful
        if 'StoppingInstances' in response:
            return {"status": "success", "message": f"Instance {instance_id} is stopping."}
        else:
            return {"status": "fail", "message": "Failed to stop the instance."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error stopping instance: {str(e)}")


@router.get("/terminate-instance/{instance_id}/{region}")
def terminate_instance(instance_id: str, region: str):

    try:
        ec2_client = boto3.client('ec2', region_name=region)
        response = ec2_client.terminate_instances(
            InstanceIds=[instance_id],
        )

        # Check if the stopping operation was successful
        if 'TerminatingInstances' in response:
            return {"status": "success", "message": f"Instance {instance_id} is terminating."}
        else:
            return {"status": "fail", "message": "Failed to terminate the instance."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error terminating instance: {str(e)}")



@router.get("/start-instance/{instance_id}/{region}")
def start_instance(instance_id: str, region: str):

    try:
        ec2_client = boto3.client('ec2', region_name=region)
        response = ec2_client.start_instances(
            InstanceIds=[instance_id],
        )

        # Check if the stopping operation was successful
        if 'StartingInstances' in response:
            return {"status": "success", "message": f"Instance {instance_id} is starting."}
        else:
            return {"status": "fail", "message": "Failed to start the instance."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting instance: {str(e)}")



@router.get("/list-regions")
def list_regions():
    regions = ec2.describe_regions()

    response = {}
    for region in regions["Regions"]:
        response[region['RegionName']] = region['Endpoint']
    return response


@router.post('/create-instance')
def create_instance(item: Instance):
    try:
        create_ec2 = boto3.resource('ec2', region_name=item.region_name)

        instance = create_ec2.create_instances(
            ImageId=item.image_id,
            InstanceType='t2.micro',
            KeyName="GlenKeys",
            MinCount=1,
            MaxCount=1,
            SecurityGroupIds=[item.security_group_id]
        )[0]

        instance.create_tags(Tags=[{'Key': 'Name', 'Value': item.instance_name}])

        return {
            'instance_created': {
                'instance_id': instance.id,
                'instance_name': item.instance_name,
                'public_ip': instance.public_ip_address
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating instance: {str(e)}")


@router.get("/instance-status/{instance_id}")
def instance_status(instance_id: str):

    try:
        status = ec2.describe_instance_status(InstanceIds=[instance_id])

        return {"status": "success", "message": status}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving instance status: {str(e)}")


@router.get("/list-instances/{region}", response_model=List[InstanceDetails])
def list_instances(region: str):
    try:
        ec2_client = boto3.client('ec2', region_name=region)
        instances = ec2_client.describe_instances()

        instance_details_list = []


        for reservation in instances['Reservations']:
            for instance in reservation['Instances']:
                tags = instance.get('Tags', [])
                instance_name_tag = next((tag for tag in tags if tag['Key'] == 'Name'), None)

                if instance_name_tag:
                    instance_name = instance_name_tag['Value']
                else:
                    instance_name = ""

                if 'SubnetId' in instance:
                    subnet_id = instance['SubnetId']
                else:
                    subnet_id = ''
                instance_details = InstanceDetails(
                    instance_id=instance['InstanceId'],
                    instance_name=instance_name,
                    subnet_id=subnet_id,
                    availability_zone=instance['Placement']['AvailabilityZone'],
                    launch_time=str(instance['LaunchTime']),
                    status=instance['State']['Name']
                )
                instance_details_list.append(instance_details)

        return instance_details_list

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing instances: {str(e)}")


@router.get("/instance-details/{instance_id}/{selected_region}")
def list_instance(instance_id: str, selected_region: str):
    try:
        ec2_client = boto3.client('ec2', region_name=selected_region)
        # Describe instances
        instances = ec2_client.describe_instances(InstanceIds=[instance_id])

        if not instances['Reservations']:
            raise HTTPException(status_code=404, detail=f"Instance with ID {instance_id} not found")

        instance = instances['Reservations'][0]['Instances'][0]

        # Get AMI details
        ami_id = instance.get('ImageId', '')
        ami_details = {}
        if ami_id:
            ami_response = ec2_client.describe_images(ImageIds=[ami_id])
            ami_details = ami_response['Images'][0] if ami_response['Images'] else {}

        # Network details
        network_interface = instance.get('NetworkInterfaces', [{}])[0]
        network_details = {
            "subnet_id": network_interface.get('SubnetId', ''),
            "availability_zone": instance.get('Placement', {}).get('AvailabilityZone', ''),
            "private_ip_address": network_interface.get('PrivateIpAddress', ''),
            "public_ip_address": network_interface.get('Association', {}).get('PublicIp', ''),
        }
        instance_name = next((tag['Value'] for tag in instance.get('Tags', []) if tag['Key'] == 'Name'), '')
        # Other important details
        other_details = {
            "instance_id": instance.get('InstanceId', ''),
            "instance_type": instance.get('InstanceType', ''),
            "instance_name": instance_name,
            "key_name": instance.get('KeyName', ''),
            "launch_time": str(instance.get('LaunchTime', '')),
            "status": instance.get('State', {}).get('Name', ''),
            "boot_mode": instance.get('BootMode', ''),
            "current_instance_boot_mode": instance.get('CurrentInstanceBootMode', ''),
        }

        # Combine all details
        result = {
            "instance_details": other_details,
            "ami_details": ami_details,
            "network_details": network_details
        }

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing instance: {str(e)}")