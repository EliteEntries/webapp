#!/bin/sh

# Define variables
IMAGE_NAME="webapp"
GCR_PATH="us-docker.pkg.dev/eliteentries-algo/eliteentries/$IMAGE_NAME/$IMAGE_NAME:latest"
REGION="us-central1"
SERVICE_NAME="webapp"

# Authenticate to Google Cloud
gcloud auth login 
gcloud auth configure-docker

# Build, tag, and push the Docker image
docker build -t $IMAGE_NAME . &&
docker tag $IMAGE_NAME $GCR_PATH &&
docker push $GCR_PATH

# Deploy to Google Cloud Run
