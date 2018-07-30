const execaWrap = require('execa-wrap')
const {join} = require('path')
const la = require('lazy-ass')

/* eslint-env mocha */
describe('stop-only', () => {
  const bin = join(__dirname, '..', 'bin', 'stop-only.js')
  const f1 = join(__dirname, 'f1')
  const f2 = join(__dirname, 'f2')
  // we are only testing exit code and standard output
  const wrapOptions = {filter: ['code', 'stdout']}

  context('finds .only', () => {
    it('finds in single folder f1', () => {
      return execaWrap('node', [bin, '--folder', f1], wrapOptions)
        .then(result => {
          la(result.includes('code: 1'), 'did not exit with 1', result)
          la(result.includes('Found .only'), 'did not find', result)
        })
    })

    it('finds in both folders f2 and f1', () => {
      return execaWrap('node', [bin, '--folder', f2, '--folder', f1], wrapOptions)
        .then(result => {
          la(result.includes('code: 1'), 'did not exit with 1', result)
          la(result.includes('Found .only'), 'did not find', result)
        })
    })

    it('finds using alias -f', () => {
      return execaWrap('node', [bin, '-f', f2, '-f', f1], wrapOptions)
        .then(result => {
          la(result.includes('code: 1'), 'did not exit with 1', result)
          la(result.includes('Found .only'), 'did not find', result)
        })
    })
  })

  context.only('warns if it finds .only', () => {
    it('in single folder f1', () => {
      return execaWrap('node', [bin, '--warn', '--folder', f1], wrapOptions)
        .then(result => {
          la(result.includes('code: 0'), 'did not exit with 0', result)
          la(result.includes('⚠️'), 'did not warn', result)
        })
    })

    it('finds in both folders f2 and f1', () => {
      return execaWrap('node', [bin, '--warn', '--folder', f2, '--folder', f1], wrapOptions)
        .then(result => {
          la(result.includes('code: 0'), 'did not exit with 0', result)
          la(result.includes('⚠️'), 'did not warn', result)
        })
    })

    it('finds using alias -f', () => {
      return execaWrap('node', [bin, '-w', '-f', f2, '-f', f1], wrapOptions)
        .then(result => {
          la(result.includes('code: 0'), 'did not exit with 0', result)
          la(result.includes('⚠️'), 'did not warn', result)
        })
    })
  })
})
