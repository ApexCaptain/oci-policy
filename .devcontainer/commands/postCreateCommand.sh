#!/usr/bin/env bash

npm install -g \
    npm@latest

git config --global --add safe.directory $CONTAINER_WORKSPACE_FOLDER
git config --global user.name "$GIT_USER_NAME"
git config --global user.email "$GIT_USER_EMAIL"