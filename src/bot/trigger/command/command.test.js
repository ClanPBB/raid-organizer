import {assert} from 'chai'
import {stub, spy} from 'sinon'
import {CommandTrigger} from './'
import {commands} from './commands'

describe('command trigger', () => {
  it('adds the help command on start', () => {
    const expected = [
      {
        command: commands.COMMAND_HELP,
        permissions: [],
        text: 'HELP_MESSAGE'
      }
    ]
    const discordClient = {
      on: spy()
    }
    const getHelphandler = {
      setCommandHelper: spy(),
      help: stub().returns('HELP_MESSAGE')
    }
    const commandTrigger = new CommandTrigger(discordClient, getHelphandler)

    assert.equal(1, getHelphandler.setCommandHelper.callCount)
    assert.equal(1, discordClient.on.callCount)
    assert.deepEqual(expected, commandTrigger.commandHelper)
  })
})
