import {Raid} from './raid'
import {
  RaidNotFoundException,
  UsernameNotListedException
} from './exceptions'
import {createEmbed} from './create-raid-embed'
import {REGIONAL_REACTIONS, KEYCAP_REACTIONS, GENERIC_REACTIONS} from '../constants'

export const RAID_DAY_KEY = 'dateTimestamp'

export class RaidDay {
  constructor (raidDay) {
    this.date = raidDay.date
    this.dateTimestamp = raidDay.dateTimestamp
    this.day = raidDay.day
    this.unavailable = raidDay.unavailable || []
    this.raids = []

    this.reload = []

    this.key = this[RAID_DAY_KEY]
  }

  getKey () {
    return this.key
  }

  addRaid (raid) {
    if (this.reload.includes(raid.id)) {
      this.reload.splice(this.reload.indexOf(raid.id), 1)
      return
    }
    this.raids.push(new Raid(raid))
  }

  flagRaidsForReload () {
    this.reload = this.raids.map(raid => raid.getId())
  }

  removeNotReloadedRaids () {
    this.reload.map(raidToRemove => {
      const index = this.raids.findIndex(raid => raid.getId() === raidToRemove)
      this.raids.splice(index, 1)
    })
    this.reload = []
  }

  getRaidsCopies () {
    const shallowCopy = this.raids.map(raid => Object.assign({}, raid))
    if (shallowCopy.length > 0) {
      shallowCopy[0].unavailable = this.unavailable
    }

    return shallowCopy
  }

  getRaidByIndex (index) {
    if (!this.raids[index]) {
      throw new RaidNotFoundException({
        key: this.key,
        index
      })
    }
    return this.raids[index]
  }

  addUnavailble (username) {
    this.unavailable.push(username)
    return [{
      username,
      key: this.key,
      date: this.date,
      day: this.day,
      list: 'unavailable',
      added: true
    }]
  }

  removeUnavailble (username) {
    if (!this.isUnavailable(username)) {
      throw new UsernameNotListedException({
        list: 'unavailable',
        username
      })
    }
    this.unavailable.splice(this.unavailable.indexOf(username), 1)
    return [{
      username,
      key: this.key,
      date: this.date,
      day: this.day,
      list: 'unavailable',
      removed: true
    }]
  }

  isUnavailable (username) {
    return this.unavailable.includes(username)
  }

  toggleUnavailable (username) {
    return (this.isUnavailable(username))
      ? this.removeUnavailble(username)
      : this.addUnavailble(username)
  }

  getBoundToggleUnavailable () {
    return (username) => {
      return this.toggleUnavailable(username)
    }
  }

  conditionalRemoveUnavailable (username, raidIndex) {
    if (this.isUnavailable(username) &&
        (this.getRaidByIndex(raidIndex).isRunner(username) || this.getRaidByIndex(raidIndex).isReserve(username))
    ) {
      return this.removeUnavailble(username)
    }
    return []
  }

  getBoundConditionalRemoveUnavailable (raidIndex) {
    return (username) => {
      return this.conditionalRemoveUnavailable(username, raidIndex)
    }
  }

  removeUserFromAllLists (username) {
    if (!this.isUnavailable(username)) {
      return []
    }
    let response = []
    this.raids.map(raid => {
      response = response.concat(raid.conditionalRemoveRunner(username))
      response = response.concat(raid.conditionalRemoveReserve(username))
    })

    return response
  }

  getBoundRemoveUserFromAllLists () {
    return (username) => {
      return this.removeUserFromAllLists(username)
    }
  }

  getUniqueHash () {
    return JSON.stringify({
      raids: this.raids,
      unavailable: this.unavailable
    })
  }

  createReactionMap () {
    const reactions = []
    const raidCount = this.raids.length
    Object.values(REGIONAL_REACTIONS)
      .slice(0, raidCount)
      .map((reaction, index) => {
        reactions.push({
          emoji: reaction,
          handler: [
            this.getRaidByIndex(index).getBoundToggleRunner(),
            this.getBoundConditionalRemoveUnavailable(index)
          ]
        })
      })
    Object.values(KEYCAP_REACTIONS)
      .slice(1, raidCount + 1)
      .map((reaction, index) => {
        reactions.push({
          emoji: reaction,
          handler: [
            this.getRaidByIndex(index).getBoundToggleReserve(),
            this.getBoundConditionalRemoveUnavailable(index)
          ]
        })
      })
    reactions.push({
      emoji: GENERIC_REACTIONS[':no_entry_sign:'],
      handler: [
        this.getBoundToggleUnavailable(),
        this.getBoundRemoveUserFromAllLists()
      ]
    })
    return reactions
  }

  getView () {
    return {
      embed: createEmbed(this),
      reactions: this.createReactionMap()
    }
  }
}
