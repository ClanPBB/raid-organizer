export class GetRaidLogChannelHandler {
  constructor (discordClient, raid, channelName) {
    this.discordClient = discordClient
    this.raid = raid
    this.channelName = channelName
  }

  handle () {
    const raidLogChannel = this.discordClient.channels.find(ch => ch.name === this.channelName)
    this.raid.setRaidLogChannel(raidLogChannel)
  }
}
