import {commands} from './commands'

export class CommandTrigger {
  constructor (discordClient, getHelpHandler) {
    this.discordClient = discordClient
    this.commandHelper = []

    this.getHelpHandler = getHelpHandler
    this.getHelpHandler.setCommandHelper(this.commandHelper)

    this.addCommand(commands.COMMAND_HELP, this.getHelpHandler)
  }

  addCommand (
    command,
    handler,
    permissions = []
  ) {
    this.commandHelper.push({
      command,
      text: handler.help(),
      permissions
    })

    this.discordClient.on('message', message => {
      if (!message.content.startsWith(command)) {
        return
      }

      const hasPermission = permissions.reduce((hasPermission, permission) => hasPermission || message.author.lastMessage.member.hasPermission(permission), true)
      if (!hasPermission) {
        return
      }
      
      const args = {
        command,
        arguments: message.content.slice(command.length),
        channel: message.channel,
        author: message.author,
        mentions: message.mentions
      }

      handler.handle(args)
    })
  }
}
