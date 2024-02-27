#!/bin/bash

# Exit script on any error
set -e

# Check if a tag name is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <tag-name>"
    exit 1
fi

TAG_NAME=$1
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Function to restore the original structure
function restore_structure {
    git checkout "$CURRENT_BRANCH"
    git branch -D "$TAG_NAME" # Delete the temporary branch
}

# Ensure clean state
if ! git diff --quiet || ! git diff --staged --quiet; then
    echo "Error: You have uncommitted changes. Please commit or stash them."
    exit 1
fi

# Step 1: Checkout to a new branch
git checkout -b "$TAG_NAME"

# Step 2: Restructure the repository
mv packages/bundles-static . && mv packages/bundles-core .
# Removing all other directories but keeping top-level files
find packages -mindepth 1 -maxdepth 1 ! -name 'A' ! -name 'B' -exec rm -rf {} +
rm -rf packages # Remove the packages directory if empty

# Step 3: Create tag and push it
git add -A
git commit -m "Restructure repo for $TAG_NAME"
git tag "$TAG_NAME"
git push origin "$TAG_NAME"

# Restore the original repository structure
restore_structure

echo "Tag $TAG_NAME created and pushed. Repository structure restored."

