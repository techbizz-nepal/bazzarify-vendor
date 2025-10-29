#!/usr/bin/env bash
set -e
set -o pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGE_NAME="techbizz/vendor:latest"
docker buildx build --platform linux/amd64 -t "$IMAGE_NAME" "$SCRIPT_DIR"
echo "Docker image '$IMAGE_NAME' built successfully."

# if argument is given as push push to docker hub
if [ "$1" == "push" ]; then
  docker push "$IMAGE_NAME"
  echo "Docker image '$IMAGE_NAME' pushed to Docker Hub successfully."
fi