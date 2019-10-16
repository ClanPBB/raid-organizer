export class GetRaidChannelHandler {
  constructor (discordClient, raid, channelName) {
    this.discordClient = discordClient
    this.raid = raid
    this.channelName = channelName
  }

  handle () {
    const raidChannel = this.discordClient.channels.find(ch => ch.name === this.channelName)
    this.raid.setRaidChannel(raidChannel)
  }
}
