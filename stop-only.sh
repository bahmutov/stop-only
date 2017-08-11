#!/bin/bash

test_folder=$1

if [ "$test_folder" == "" ]; then
  echo "Missing folder to search for .only"
  exit 1
fi

if grep --line-number --recursive '\.only' $test_folder; then
  echo "Found .only in folder '$test_folder' 👎"
  exit 1
fi
