import {assert} from 'chai'
import {PingHandler} from './'

describe('ping', () => {
  it('returns help string', () => {
    const pingHandler = new PingHandler()
  
    assert.isString(pingHandler.help())
  })

  it('has handle', () => {
    const pingHandler = new PingHandler()
  
    assert.isFunction(pingHandler.handle)
  })
})
