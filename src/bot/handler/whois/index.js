import mustache from 'mustache'
import {translations} from '../../../locales'

export class WhoisHandler {
  constructor (discordClient, clan) {
    this.discordClient = discordClient
    this.clan = clan
  }

  help () {
    return translations.HELP_WHOIS
  }

  handle (args) {
    if (!args.channel) {
      console.log(translations.ERROR_CHANNEL_INFO_MISSING)
    }

    const usernames = (args.mentions && args.mentions.users)
      ? args.mentions.users.map((currentItem) => currentItem.username.toLowerCase())
      : []

    const allArgs = args.arguments.split(/[\s]/)

    allArgs.map((currentItem) => {
      const lowerCase = currentItem.toLowerCase()
      if (lowerCase === '' ||
          lowerCase.substring(0, 2) === '<@' || // mentions
          usernames.includes(lowerCase)) {
        return
      }
      usernames.push(lowerCase)
    })

    const clanData = usernames.reduce((aggregator, currentItem) => {
      const userData = this.clan.getMemberByDiscordName(currentItem)
      if (!userData.uplay) {
        userData.uplay = translations.CLAN_UNKNOWN_MEMBER
      }
      aggregator.push(userData)
      return aggregator
    }, [])

    args.channel.send(
      mustache.render(
        translations.MESSAGE_WHOIS,
        {clan: clanData}
      )
    )
  }
}
