#!/usr/bin/env node

const debug = require('debug')('stop-only')
const argv = require('minimist')(process.argv.slice(2), {
  string: 'folder',
  boolean: 'warn',
  alias: {
    warn: 'w',
    folder: 'f'
  }
})

debug('stop-only arguments')
if (debug.enabled) {
  console.log(argv)
}

