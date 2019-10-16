import {translations} from '../locales'
import {commands} from './trigger/command/commands'
import {Permissions} from 'discord.js'

export class PbbBot {
  constructor (
    client,
    sheets,
    clan,
    triggers = {},
    handlers = {},
    config
  ) {
    this.discordClient = client
    this.sheetsApi = sheets
    this.clan = clan
    this.serverReadyTrigger = triggers.serverReadyTrigger
    this.commandTrigger = triggers.commandTrigger
    this.intervalTrigger = triggers.intervalTrigger
    
    this.config = config

    this.serverReadyTrigger.addHandler(handlers.serverConnectedHandler)
    this.serverReadyTrigger.addHandler(handlers.getRaidChannelHandler)
    this.serverReadyTrigger.addHandler(handlers.getRaidLogChannelHandler)
    this.commandTrigger.addCommand(commands.COMMAND_PING, handlers.pingHandler)
    this.commandTrigger.addCommand(commands.COMMAND_WHOIS, handlers.whoisHandler)
    this.commandTrigger.addCommand(commands.COMMAND_WHOAMI, handlers.whoAmIHandler)
    this.commandTrigger.addCommand(commands.COMMAND_REFRESH_CLAN, handlers.refreshClanIHandler)
    this.commandTrigger.addCommand(commands.COMMAND_IAM, handlers.iamHandler)
    this.commandTrigger.addCommand(
      commands.COMMAND_RELOAD_RAIDS,
      handlers.reloadRaidHandler,
      [
        Permissions.FLAGS.MANAGE_MESSAGES
      ])
    this.intervalTrigger.addInterval(60, handlers.refreshRaidHandler)
    this.intervalTrigger.addInterval(2, handlers.readReactionsHandler)
  }

  connect () {
    console.log(translations.INFO_BOT_CONNECTION)
    this.discordClient.login(this.config.PBB_BOT_TOKEN)
  }
}
