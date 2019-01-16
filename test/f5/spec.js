// this spec has .only in the comment and it is ok
describe.only('detects this suite', () => {
  context.only('detects this context', () => {
    it('is normal test', () => {
      // .only is inside and it is ok
    })

    it.only('this test is detected', () => {})
  })
})
