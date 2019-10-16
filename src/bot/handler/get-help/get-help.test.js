import {assert} from 'chai'
import {GetHelpHandler} from './'

describe('get help', () => {
  it('returns help string', () => {
    const getHelpHandler = new GetHelpHandler()
  
    assert.isString(getHelpHandler.help())
  })

  it('has handle', () => {
    const getHelpHandler = new GetHelpHandler()
  
    assert.isFunction(getHelpHandler.handle)
  })
})
