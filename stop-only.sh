#!/bin/bash

if [ "$1" = "--warn" ]; then
  # only warn the user
  warn=1
  test_folder=$2
  # take all command line arguments except the first one "--warn"
  arguments=${@:2}
else
  # treat found .only as an error
  warn=0
  test_folder=$1
  arguments=$@
fi

if [ "$test_folder" == "" ]; then
  echo "Missing folder to search for .only"
  exit 1
fi

if grep --line-number --recursive '\.only' $arguments; then
  if [ $warn = 1 ]; then
    echo "⚠️ Found .only in folder '$test_folder'"
  else
    echo "Found .only in folder '$test_folder' 👎"
    exit 1
  fi
fi
