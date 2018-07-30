#!/usr/bin/env node

const execa = require('execa')
const debug = require('debug')('stop-only')
const argv = require('minimist')(process.argv.slice(2), {
  string: ['folder', 'skip'],
  boolean: 'warn',
  alias: {
    warn: 'w',
    folder: 'f',
    skip: 's'
  }
})

if (debug.enabled) {
  console.log('stop-only arguments')
  console.log(argv)
}

if (!argv.folder || !argv.folder.length) {
  console.error(
    '🔥 stop-only: pass at least a single folder with --folder, -f argument'
  )
  process.exit(1)
}

let skipFolders = []
if (argv.skip) {
  skipFolders = skipFolders.concat(argv.skip)
}
let grepArguments = ['--line-number', '--recursive', '\\.only']

if (skipFolders.length) {
  skipFolders.forEach(folder => {
    grepArguments.push('--exclude-dir', folder)
  })
}

grepArguments = grepArguments.concat(argv.folder)

if (debug.enabled) {
  console.log('grep arguments')
  console.log(grepArguments)
}

const grepFinished = result => {
  if (result.code > 1) {
    console.error('Failed to run grep')
    console.error('grep arguments were')
    console.error(grepArguments)
    console.error(result)
    process.exit(result.code)
  }

  if (result.code === 1) {
    debug('could not find .only in any folder')
    process.exit(0)
  }

  // found ".only" somewhere
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

execa('grep', grepArguments).then(grepFinished, grepFinished)
