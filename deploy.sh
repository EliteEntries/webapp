#!/bin/sh

# Define variables
IMAGE_NAME="webapp"
GCR_PATH="gcr.io/eliteentries-algo/$IMAGE_NAME"
REGION="us-central1"
SERVICE_NAME="webapp"

# Build, tag, and push the Docker image
docker build -t $IMAGE_NAME . &&
docker tag $IMAGE_NAME $GCR_PATH &&
docker push $GCR_PATH

# Deploy to Google Cloud Run
gcloud run deploy $SERVICE_NAME \
    --image $GCR_PATH \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated