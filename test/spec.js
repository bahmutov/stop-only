const execaWrap = require('execa-wrap')
const {join} = require('path')
const la = require('lazy-ass')

const fromThisFolder = join.bind(null, __dirname)

/* eslint-env mocha */
describe('stop-only', () => {
  const bin = fromThisFolder('..', 'bin', 'stop-only.js')
  const f1 = fromThisFolder('f1')
  const f2 = fromThisFolder('f2')
  const f3 = fromThisFolder('f3')
  const f4 = fromThisFolder('f4')

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

    it('finds in both folders f1, f2', () => {
      return execaWrap('node', [bin, '--folder', f2 + ',' + f1], wrapOptions)
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

    describe('exclude option', () => {
      it('skips folder with a flag --skip', () => {
        return execaWrap('node', [bin, '-f', f3, '--skip', 'skip'], wrapOptions)
          .then(result => {
            la(result.includes('code: 0'), 'did not exit with 0', result)
          })
      })

      it('skips folder with an alias -s', () => {
        return execaWrap('node', [bin, '-f', f3, '-s', 'skip'], wrapOptions)
          .then(result => {
            la(result.includes('code: 0'), 'did not exit with 0', result)
          })
      })

      it('skips folder with an alias -s and commas', () => {
        return execaWrap('node', [bin, '-f', f3, '-s', 'skip,foo,bar'], wrapOptions)
          .then(result => {
            la(result.includes('code: 0'), 'did not exit with 0', result)
          })
      })

      it('skips file when using --exclude option', () => {
        return execaWrap('node', [bin, '-f', f4, '--exclude', 'spec.js'], wrapOptions)
          .then(result => {
            la(result.includes('code: 0'), 'did not exit with 0', result)
          })
      })

      it('skips file when using -e option, which is alias to --exclude', () => {
        return execaWrap('node', [bin, '-f', f4, '-e', 'spec.js'], wrapOptions)
          .then(result => {
            la(result.includes('code: 0'), 'did not exit with 0', result)
          })
      })
    })
  })

  context('warns if it finds .only', () => {
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
