#!/usr/bin/env bash

# Install APT Pakcages
sudo apt update -y
sudo apt upgrade -y 
sudo apt install -y \
    python3-venv

# Setup git config
git config --global --add safe.directory $CONTAINER_WORKSPACE_FOLDER
git config --global user.name "$GIT_USER_NAME"
git config --global user.email "$GIT_USER_EMAIL"

# Install Global npm packages
npm install -g \
    npm@latest