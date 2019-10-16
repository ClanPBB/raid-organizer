import mustache from 'mustache'
import {translations} from '../../../locales'

export class IamHandler {
  constructor (discordClient, clan) {
    this.discordClient = discordClient
    this.clan = clan
  }

  help () {
    return translations.HELP_IAM
  }

  handle (args) {
    const {channel, author} = args
    if (!channel) {
      console.log(translations.ERROR_CHANNEL_INFO_MISSING)
    }

    const userData = this.clan.authorizedQuery(author.id, author.username)
    const allArgs = args.arguments.split(/[\s]/)

    const uplay = allArgs.reduce((aggregator, currentItem) => {
      if (aggregator === '' &&
          currentItem !== '') {
        aggregator = currentItem
      }

      return aggregator
    })

    if (!uplay) {
      args.channel.send(translations.IAM_MISSING_TAG)
    }

    userData.uplay = uplay
    this.clan.saveMembers()

    args.channel.send(
      mustache.render(
        translations.IAM_TAG_UPDATED,
        {...userData}
      )
    )
  }
}
