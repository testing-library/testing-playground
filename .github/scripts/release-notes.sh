#!/usr/bin/env bash
set -euo pipefail

echo "PATH: $(dirname $(realpath $0))"

: "${ESCAPE:=${GITHUB_ACTIONS:-false}}"

# generate release notes
CHANGELOG="$(npm run --silent ci:changelog)"

# escape newlines for github actions
if [ "$ESCAPE" != false ]; then
  echo "escape it"
  CHANGELOG="${CHANGELOG//'%'/'%25'}"
  CHANGELOG="${CHANGELOG//$'\n'/'%0A'}"
  CHANGELOG="${CHANGELOG//$'\r'/'%0D'}"
fi

# export some data
echo "::set-output name=changelog::$CHANGELOG"
