#!/bin/bash

#Variables
REG_ADDRESS="169956085459.dkr.ecr.eu-west-1.amazonaws.com"
# Use environment variable provided by Jenkins
REPO=$JOB_BASE_NAME
PADDED_BUILD_NUMBER=$(printf "%04d" $BUILD_NUMBER)
IMAGE_VERSION=$PADDED_BUILD_NUMBER-$GIT_COMMIT
WORKSPACE_PATH="."

#Login to ECR Repository
LOGIN_STRING=`aws ecr get-login --region eu-west-1`
${LOGIN_STRING}

#Build the containerexit
cd ${WORKSPACE_PATH}
docker build -t ${REPO}:${IMAGE_VERSION} .

# Run tests
docker run --rm ${REPO}:${IMAGE_VERSION} test

DOCKER_IMAGE=${REG_ADDRESS}/${REPO}:${IMAGE_VERSION}

#Tag the build with BUILD_NUMBER version and Latests
docker tag ${REPO}:${IMAGE_VERSION} ${DOCKER_IMAGE}

#Push builds
docker push ${DOCKER_IMAGE}

# Clean up
docker rmi ${REPO}:${IMAGE_VERSION} ${DOCKER_IMAGE}
