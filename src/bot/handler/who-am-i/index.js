import mustache from 'mustache'
import {translations} from '../../../locales'

export class WhoAmIHandler {
  constructor (discordClient, clan) {
    this.discordClient = discordClient
    this.clan = clan
  }

  help () {
    return translations.HELP_WHOAMI
  }

  handle (args) {
    const {channel, author} = args
    if (!channel) {
      console.log(translations.ERROR_CHANNEL_INFO_MISSING)
    }

    const userData = this.clan.authorizedQuery(author.id, author.username)
    if (!userData.uplay) {
      userData.uplay = translations.CLAN_UNKNOWN_MEMBER
    }

    args.channel.send(
      mustache.render(
        translations.MESSAGE_WHOIS,
        {clan: [userData]}
      )
    )
  }
}
