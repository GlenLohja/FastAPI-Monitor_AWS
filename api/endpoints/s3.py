# api/endpoints/s3.py
import boto3
from fastapi import HTTPException, APIRouter
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from datetime import datetime

router = APIRouter()


class Bucket(BaseModel):
    location: str
    name: str


@router.get("/delete-bucket/{bucket_name}/{file_name}")
def stop_instance(bucket_name: str, file_name: str):

    try:
        s3 = boto3.resource('s3')
        s3.Object(bucket_name, file_name).delete()

        return {"message": f"File '{file_name}' deleted from bucket '{bucket_name}' successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting bucket: {str(e)}")


@router.get("/list-buckets")
def list_buckets():
    s3 = boto3.client('s3')
    response = s3.list_buckets()

    return response


@router.get("/download-file/{bucket_name}/{file_name}")
def download_file_from_bucket(bucket_name: str, file_name: str):
    try:
        s3 = boto3.resource('s3')

        file_obj = s3.Object(bucket_name, file_name)

        file_data = file_obj.get()['Body'].read()

        # Wrap the bytes in a list to create an iterable
        return StreamingResponse(iter([file_data]), media_type="application/octet-stream", headers={"Content-Disposition": f"attachment;filename={file_name}"})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error downloading file: {str(e)}")


@router.get("/list-objects/{bucket_name}")
def list_objects_in_bucket(bucket_name: str):
    try:
        # Create an S3 resource
        s3 = boto3.resource('s3')

        # Get the bucket
        bucket = s3.Bucket(bucket_name)

        # List all objects in the bucket
        objects_list = [obj.key for obj in bucket.objects.all()]

        # Access the creation_date attribute directly (it's already a datetime object)
        creation_date = bucket.creation_date

        # Format the datetime object as "dd-mm-yyyy h:i:s"
        formatted_datetime = creation_date.strftime("%d-%m-%Y %H:%M:%S")
        return {"bucket_name": bucket_name, "objects": objects_list,
                "creation_date": formatted_datetime, "total_objects": len(objects_list)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing objects in bucket: {str(e)}")


@router.post('/create-bucket')
def create_bucket(item: Bucket):
    try:
        s3_client = boto3.client('s3', region_name=item.location)

        existing_buckets = [bucket['Name'] for bucket in s3_client.list_buckets()['Buckets']]
        if item.name in existing_buckets:
            raise HTTPException(status_code=400, detail="Bucket already exists")

        bucket_location = {'LocationConstraint': item.location}
        s3_client.create_bucket(Bucket=item.name, CreateBucketConfiguration=bucket_location)

        return {"message": f"Bucket '{item.name}' created successfully"}

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating bucket: {str(e)}")