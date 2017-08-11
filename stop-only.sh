#!/bin/bash

test_folder=$1

if [ "$test_folder" == "" ]; then
  echo "Missing folder to search for .only"
  exit 1
fi

# echo "command"
# echo grep --line-number --recursive '\.only' "$@"

if grep --line-number --recursive '\.only' "$@"; then
  echo "Found .only in folder '$test_folder' 👎"
  exit 1
fi
