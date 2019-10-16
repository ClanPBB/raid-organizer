export class Clan {
  constructor (
    clanRepository
  ) {
    this.clanRepository = clanRepository

    this.members = {}
    this.membersById = {}
  }

  getMemberByDiscordName (discordName) {
    if (this.members.hasOwnProperty(discordName)) {
      return this.members[discordName]
    }

    return {
      discord: discordName
    }
  }

  async loadMembers () {
    const members = await this.clanRepository.loadMembers()

    this.membersById = {}
    this.members = members.reduce((aggregator, currentItem) => {
      const key = currentItem.discord.toLowerCase()
      aggregator[key] = currentItem
      
      if (currentItem.id !== '') {
        this.membersById[currentItem.id] = currentItem
      }

      return aggregator
    }, {})
  }

  async saveMembers () {
    await this.clanRepository.saveMembers(this.members)
  }

  updateDiscordName (id, discordName) {
    const key = discordName.toLowerCase()
    const idKnown = this.membersById.hasOwnProperty(id)
    const nameKnown = this.members.hasOwnProperty(key)

    if (idKnown) {
      this.membersById[id].discord = discordName
      this.saveMembers()
      return
    }

    if (nameKnown) {
      this.members[key].id = id
    } else {
      this.members[key] = {
        id,
        discord: discordName
      }
    }
    this.membersById[id] = this.members[key]
    this.saveMembers()
  }

  validateDiscordName (id, discordName) {
    if (!id || !discordName) {
      throw new Error('ID_AND_DISCORDNAME_REQUIRED')
    }

    const idKnown = this.membersById.hasOwnProperty(id)

    if (idKnown && this.membersById[id].discord === discordName) {
      return
    }

    this.updateDiscordName(id, discordName)
  }

  authorizedQuery (id, discordName) {
    this.validateDiscordName(id, discordName)
    return this.membersById[id]
  }
}
