import {assert} from 'chai'
import {WhoisHandler} from './'

describe('Who is', () => {
  it('returns help string', () => {
    const whoisHandler = new WhoisHandler()
  
    assert.isString(whoisHandler.help())
  })

  it('has handle', () => {
    const whoisHandler = new WhoisHandler()
  
    assert.isFunction(whoisHandler.handle)
  })
})
