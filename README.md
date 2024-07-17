# FastAPI-Monitor_AWS

A web application developed with FastAPI for the backend and React for the frontend. The application consists of three main pages: one for EC2 resources, one for S3 resources, and one for monitoring using CloudWatch.

## S3 Resources Page

The UI for the S3 page allows users to search and select a bucket and display all objects inside the bucket. Two methods are available on this page to manage the objects in the bucket:

- **Delete Object**: Delete an object from the bucket.
- **Download Object**: Download an object from the bucket.

![S3 Page](https://github.com/user-attachments/assets/34f5b906-6732-443d-91cd-cb8ff443e289)
![S3 Page](https://github.com/user-attachments/assets/8a70b690-bd7c-4952-b9a5-a8114abf9e5c)

## EC2 Instance Page

The UI for the EC2 Instance page allows users to search for an instance based on the instance name or instance region. Users can also terminate an instance by clicking the terminate button inside the instances table.

![EC2 Page](https://github.com/user-attachments/assets/d42a5969-8f98-4771-a1d8-6d7ed3aeb19f)

Users can get a detailed view by clicking the instance ID. The detailed instance view displays network, instance, and AMI image details. Two methods are available:

- **Stop Instance**: Stop a running instance (visible when the instance is running).
- **Start Instance**: Start a stopped instance.

![Detailed Instance View](https://github.com/user-attachments/assets/a2495141-17a4-42f4-b41b-e54b14fb734a)

There is also a method to create a new instance, highlighted in the following figure.

![Create New Instance](https://github.com/user-attachments/assets/a242a679-a24a-444f-922b-7fdb6d4faed4)

## Monitoring Page

The monitoring page allows users to select a region and an instance to get a detailed view of the CPU utilization and a timeline of the CPU credit balance usage.

![Monitoring Page](https://github.com/user-attachments/assets/827089ff-a70c-488f-898d-b42752660427)

## APIs

All the APIs used for this project are highlighted in the following figure.

![APIs](https://github.com/user-attachments/assets/f09d6e7b-0c8f-432f-bede-6ec21a8b6f98)
