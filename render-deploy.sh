#!/bin/bash

# Render deployment script

# Install dependencies
echo "Installing dependencies..."
yarn install

# Build the application
echo "Building application..."
yarn build

# Skip database migrations as we're using Firebase
echo "Using Firebase for data storage, skipping PostgreSQL migrations..."

# Start the application
echo "Starting application..."
yarn start