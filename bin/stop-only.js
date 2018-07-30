#!/usr/bin/env node

const execa = require('execa')
const debug = require('debug')('stop-only')
const argv = require('minimist')(process.argv.slice(2), {
  string: 'folder',
  boolean: 'warn',
  alias: {
    warn: 'w',
    folder: 'f'
  }
})

if (debug.enabled) {
  console.log('stop-only arguments')
  console.log(argv)
}

const grepArguments = ['--line-number', '--recursive', '\\.only'].concat(argv.folder)
if (debug.enabled) {
  console.log('grep arguments')
  console.log(grepArguments)
}

const grepFailed = (result) => {
  console.error('grep with arguments below failed')
  console.error(grepArguments)
  console.error(result)
  process.exit(2)
}

const grepFinished = (result) => {
  if (result.code) {
    console.error('Failed to run grep')
    console.error('grep arguments were')
    console.error(grepArguments)
    console.error(result)
    process.exit(result.code)
  }

  if (result.stdout) {
    if (argv.warn) {
      console.log('⚠️ Found .only in folder(s)')
      console.log(result.stdout)
      process.exit(0)
    } else {
      console.log('Found .only in folder(s) 👎')
      console.log(result.stdout)
      process.exit(1)
    }
  }
  // else did not find ".only" anywhere in the specified folder(s)
}

execa('grep', grepArguments)
.then(grepFinished, grepFailed)
