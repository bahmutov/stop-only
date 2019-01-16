#!/usr/bin/env node

const execa = require('execa')
const debug = require('debug')('stop-only')
const argv = require('minimist')(process.argv.slice(2), {
  string: ['folder', 'skip', 'exclude'],
  boolean: 'warn',
  alias: {
    warn: 'w',
    folder: 'f',
    skip: 's',
    exclude: 'e'
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

const toArray = x => (Array.isArray(x) ? x : [x])

const normalizeStrings = listOrString => {
  const strings = toArray(listOrString)
  // ? can we just split and flatten result array?
  let normalized = []
  strings.forEach(s => {
    if (s === undefined || s === null) {
      return
    }

    if (s.includes(',')) {
      normalized = normalized.concat(s.split(','))
    } else {
      normalized.push(s)
    }
  })
  return normalized
}

// user should be able to pass multiple folders with single argument separated by commas
// like "--folder foo,bar,baz"
// next code block splits these arguments and normalizes everything into list of strings
const splitFolders = normalizeStrings(argv.folder)
debug('split folders', splitFolders)

const skipFolders = normalizeStrings(argv.skip)
const skipFiles = normalizeStrings(argv.exclude)

let grepArguments = [
  '--line-number',
  '--recursive',
  '[describe|context|it]\\.only'
]

if (skipFolders.length) {
  skipFolders.forEach(folder => {
    grepArguments.push('--exclude-dir', folder)
  })
}

if (skipFiles.length) {
  skipFiles.forEach(filename => {
    grepArguments.push('--exclude', filename)
  })
}

grepArguments = grepArguments.concat(splitFolders)

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
