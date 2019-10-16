import {translations} from '../../../locales'

export class RefreshClanHandler {
  constructor (discordClient, clan) {
    this.discordClient = discordClient
    this.clan = clan
  }

  help () {
    return translations.HELP_REFRESH_CLAN
  }

  handle (args) {
    const {channel} = args
    if (!channel) {
      console.log(translations.ERROR_CHANNEL_INFO_MISSING)
    }

    this.clan.loadMembers()

    args.channel.send(translations.CLAN_REFRESHED)
  }
}
