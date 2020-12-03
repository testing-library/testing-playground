#!/usr/bin/env bash
set -euo pipefail

# We don't want the `tip` tag to affect our changelog, and also don't want it to be used for the nighly version
git tag -d tip &> /dev/null || :

# PUSHING A TAG TRIGGERS A VERSIONED RELEASE, ANY OTHER PUSH TRIGGERS A NIGHTLY
REF=$(echo "$GITHUB" | jq -r '.ref')
VERSION=$(echo "${REF#refs/tags/}")

# export some data
set-env () {
  echo "$1=$2" >> $GITHUB_ENV
  export $1="$2"
}

set-env "VERSION" "$VERSION"