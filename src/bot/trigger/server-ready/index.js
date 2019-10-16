export class ServerReadyTrigger {
  constructor (discordClient) {
    this.discordClient = discordClient
  }

  addHandler (handler, ...args) {
    this.discordClient.on('ready', () => {
      handler.handle(args)
    })
  }
}
