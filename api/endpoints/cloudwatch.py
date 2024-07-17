# api/endpoints/cloudwatch.py
import boto3
from fastapi import HTTPException, APIRouter
from pydantic import BaseModel
from datetime import datetime, timedelta

router = APIRouter()
client = boto3.client('cloudwatch', region_name='eu-west-1')


@router.get("/monitor-instance/{instance_id}")
def instance_status(instance_id: str):

    try:
        response = client.list_metrics(
            Namespace='AWS/EC2',
            Dimensions=[
                {
                    'Name': 'InstanceId',
                    'Value': instance_id
                },
            ],
        )
        # return response
        data = {}

        current_time = datetime.utcnow()
        start_time = current_time - timedelta(hours=2)
        start_time_str = start_time.strftime('%Y-%m-%dT%H:%M:%SZ')
        end_time_str = current_time.strftime('%Y-%m-%dT%H:%M:%SZ')

        for metric in response['Metrics']:

            if "CPU" in metric['MetricName']:
                data_response = client.get_metric_data(
                    MetricDataQueries=[
                        {
                            'Id': 'm1',
                            'MetricStat': {
                                'Metric': {
                                    'Namespace': 'AWS/EC2',
                                    'MetricName': metric['MetricName'],
                                    'Dimensions': [
                                        {
                                            'Name': 'InstanceId',
                                            'Value': instance_id
                                        },
                                    ]
                                },
                                'Period': 60,
                                'Stat': 'Average',
                            },
                            'ReturnData': True,
                        },
                    ],
                    StartTime=start_time_str,
                    EndTime=end_time_str
                )


                label = data_response['MetricDataResults'][0]['Label']
                timestamps = data_response['MetricDataResults'][0]['Timestamps']
                values = data_response['MetricDataResults'][0]['Values']

                data[label] = {timestamp: value for timestamp, value in zip(timestamps, values)}

        return data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving instance monitor data: {str(e)}")
