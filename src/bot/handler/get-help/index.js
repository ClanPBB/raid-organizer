import mustache from 'mustache'
import {translations} from '../../../locales'

export class GetHelpHandler {
  constructor (discordClient) {
    this.discordClient = discordClient
  }

  setCommandHelper (commandHelper) {
    this.commandHelper = commandHelper
  }

  help () {
    return translations.HELP_GET_HELP
  }

  handle (args) {
    if (!args.channel) {
      console.log(translations.ERROR_CHANNEL_INFO_MISSING)
    }

    args.channel.send(
      mustache.render(
        translations.MESSAGE_HELP,
        {commands: this.commandHelper}
      )
    )
  }
}
