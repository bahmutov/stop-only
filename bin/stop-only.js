#!/usr/bin/env node

const execa = require('execa')
const debug = require('debug')('stop-only')
const argv = require('minimist')(process.argv.slice(2), {
  string: ['folder', 'skip', 'exclude', 'file', 'text'],
  boolean: 'warn',
  alias: {
    warn: 'w',
    folder: 'f',
    skip: 's',
    exclude: 'e'
  }
})

function escapeRegExp (string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

if (debug.enabled) {
  console.log('stop-only arguments')
  console.log(argv)
}

const isString = x => typeof x === 'string'

const hasFolderArgument = isString(argv.folder) || Array.isArray(argv.folder)
const hasFileArgument = isString(argv.file)

if (!hasFolderArgument && !hasFileArgument) {
  console.error(
    '🔥 stop-only: pass at least a single folder with --folder, -f argument, or a file path with --file'
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

let grepArguments = ['--line-number', '--recursive']

if (argv.text) {
  if (Array.isArray(argv.text)) {
    debug('multiple text search')
    grepArguments.push('--extended-regexp')
    const escaped = argv.text.map(escapeRegExp)
    grepArguments.push(`(${escaped.join('|')})`)
  } else {
    debug('simple text search')
    grepArguments.push(argv.text)
  }
} else {
  // simply find ".only" after suite / test
  grepArguments.push('--extended-regexp')
  grepArguments.push('(describe|context|it)\\.only')
}

if (hasFileArgument) {
  grepArguments.push(argv.file)
} else {
  // checking folder(s)

  // user should be able to pass multiple folders with single argument separated by commas
  // like "--folder foo,bar,baz"
  // next code block splits these arguments and normalizes everything into list of strings
  const splitFolders = normalizeStrings(argv.folder)
  debug('split folders', splitFolders)

  const skipFolders = normalizeStrings(argv.skip)
  const skipFiles = normalizeStrings(argv.exclude)

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
}

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
    if (argv.text) {
      debug('could not find "%s" anywhere', argv.text)
    } else {
      debug('could not find .only anywhere')
    }
    process.exit(0)
  }

  // found ".only" or specific text somewhere
  if (argv.warn) {
    if (argv.text) {
      console.log('⚠️ Found "%s" in', argv.text)
    } else {
      console.log('⚠️ Found .only in')
    }
    console.log(result.stdout)
    process.exit(0)
  } else {
    if (argv.text) {
      console.log('Found "%s" here 👎', argv.text)
    } else {
      console.log('Found .only here 👎')
    }
    console.log(result.stdout)
    process.exit(1)
  }
}

execa('grep', grepArguments).then(grepFinished, grepFinished)
