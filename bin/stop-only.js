#!/usr/bin/env node

const debug = require('debug')('stop-only')
const argv = require('minimist')(process.argv.slice(2))

debug('stop-only arguments')
if (debug.enabled) {
  console.log(argv)
}

