const execaWrap = require('execa-wrap')
const {join} = require('path')

/* eslint-env mocha */
describe('stop-only', () => {
  const bin = join(__dirname, '..', 'bin', 'stop-only.js')
  const f1 = join(__dirname, 'f1')
  const f2 = join(__dirname, 'f2')

  context('finds .only', () => {
    it('finds in single folder f1', () => {
      return execaWrap('node', [bin, '--folder', f1]).then(console.log)
    })
  })
})
