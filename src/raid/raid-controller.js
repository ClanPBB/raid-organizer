import {getRaidKeyFromMessage} from './create-raid-embed'
import {RAID_DAY_KEY, RaidDay} from './raid-day'
import {translations} from '../locales'
import mustache from 'mustache'

export class RaidController {
  constructor (
    raidRepository,
    discordClient,
    config
  ) {
    this.raidRepository = raidRepository
    this.discordClient = discordClient
    this.config = config
    this.channel = null
    this.logChannel = null

    this.messages = {}

    this.raidDays = {}
    this.raidDates = []
  }

  async setRaidChannel (channel) {
    this.channel = channel

    await this.checkMessagesForRaids()
    this.loadRaids()
  }

  async setRaidLogChannel (channel) {
    this.logChannel = channel
  }

  async checkMessagesForRaids () {
    const messages = await this.channel.fetchMessages()
    this.messages = {}
    messages.map(currentMessage => {
      if (currentMessage.embeds.length > 0) {
        const dateTimestamp = getRaidKeyFromMessage(currentMessage)

        this.messages[dateTimestamp] = {
          key: dateTimestamp,
          hash: null,
          message: currentMessage
        }
      }
    })
  }

  async sendChannelMessage (message, options) {
    if (!this.channel) {
      console.error('Channel not found')
      return
    }
    return this.channel.send(message, options)
  }

  transformRaidInput (aggregator, currentItem, sortOrder) {
    const key = currentItem[RAID_DAY_KEY]
    currentItem.sortOrder = sortOrder + 1 // To set the first index to 1, as 0 evalutes to false and Raid constructor will overwrite it to 1000
    if (!aggregator[key]) {
      aggregator[key] = new RaidDay(currentItem)
    }
    aggregator[key].addRaid(currentItem)
    
    return aggregator
  }

  async loadRaids () {
    const raids = await this.raidRepository.loadRaids()

    Object.values(this.raidDays).map(raid => raid.flagRaidsForReload())
    this.raidDays = raids.reduce(this.transformRaidInput, this.raidDays)
    Object.values(this.raidDays).map(raid => raid.removeNotReloadedRaids())
    this.raidDates = Object.keys(this.raidDays).reduce((aggregator, currentItem) => {
      if (!aggregator.includes(currentItem)) {
        aggregator.push(currentItem)
      }
      return aggregator
    }, [])
    this.raidDates.sort()
    this.publishAllRaids()
  }

  async saveRaids () {
    const ordered = Object.values(this.raidDays)
      .reduce(
        (aggregator, raidDay) => aggregator.concat(raidDay.getRaidsCopies()),
        []
      )
      .sort((a, b) => a.sortOrder - b.sortOrder)
    await this.raidRepository.saveRaids(ordered)
  }

  handleReactions (reactions, username) {
    try {
      return reactions.map(currentReaction => {
        return currentReaction.handler.map(currentHandler => currentHandler(username))
      })
    } catch (e) {
      this.sendChannelMessage(e.message)
      return false
    }
  }

  informUser (allReactionResults) {
    if (!this.logChannel) {
      return
    }
    allReactionResults.map(
      reactionResults => reactionResults.map(
        results => results.map(
          result => {
            if (result.added) {
              switch (result.list) {
                case 'runner':
                  this.logChannel.send(mustache.render(
                    translations.JOINED_AS_RUNNER,
                    {...result}
                  ))
                  break
                case 'reserve':
                  this.logChannel.send(mustache.render(
                    translations.JOINED_AS_RESERVE,
                    {...result}
                  ))
                  break
              }
            }

            if (result.removed) {
              switch (result.list) {
                case 'runner':
                  this.logChannel.send(mustache.render(
                    translations.LEFT_AS_RUNNER,
                    {...result}
                  ))
                  break
                case 'reserve':
                  this.logChannel.send(mustache.render(
                    translations.LEFT_AS_RESERVE,
                    {...result}
                  ))
                  break
              }
            }
          }
        )
      )
    )
  }

  readReactions (message) {
    const hasToRefresh = message.message.reactions.reduce(
      (hasToRefresh, currentReaction) => {
        const encodedEmoji = encodeURI(currentReaction._emoji.name)
        const users = currentReaction.users.filter(currentUser => !currentUser.bot)
        const result = users.reduce((hasToRefresh, currentUser) => {
          currentReaction.remove(currentUser)
          if (message.reactions) {
            const reactions = message.reactions.filter(reaction => reaction.emoji === encodedEmoji)
            const result = this.handleReactions(reactions, currentUser.username)
            if (!result) {
              return hasToRefresh || result
            }
            
            this.informUser(result)
            return hasToRefresh || result.length > 0
          }
        }, false)
        return hasToRefresh || result
      }, false)
    if (!hasToRefresh) {
      return
    }
    this.saveRaids()
    this.publishRaid(this.raidDays[message.key])
  }

  readAllReactions () {
    Object.values(this.raidDays).map(async raidDay => {
      if (!this.messages[raidDay.dateTimestamp]) {
        return
      }
      this.readReactions(this.messages[raidDay.dateTimestamp])
    })
  }

  async addReactions (raidDay) {
    const reactionsOnMessage = [...raidDay.message.reactions.keys()]
    const emojisChanged = reactionsOnMessage.length !== raidDay.reactions.length ||
      reactionsOnMessage.reduce(
        function (emojisChanged, currentIcon, index) {
          return emojisChanged || !raidDay.reactions[index] || currentIcon !== decodeURI(raidDay.reactions[index].emoji)
        },
        false
      )
    if (!emojisChanged) {
      return
    }
    await raidDay.message.clearReactions()
    for (let i = 0; i < raidDay.reactions.length; i += 1) {
      await raidDay.message.react(raidDay.reactions[i].emoji)
    }
  }

  async publishRaid (raidDay) {
    const hash = raidDay.getUniqueHash()
    const key = raidDay.dateTimestamp
    if (this.messages[key] &&
        this.messages[key].hash === hash) {
      return
    }

    const {embed, reactions} = raidDay.getView()
    if (!this.messages[key]) {
      this.messages[key] = {
        hash,
        reactions,
        message: await this.sendChannelMessage(embed)
      }
    } else {
      this.messages[key].message.edit(embed)
      this.messages[key].reactions = reactions
      this.messages[key].hash = hash
    }
    this.addReactions(this.messages[key])
  }

  async publishAllRaids () {
    if (Object.values(this.raidDays).length === 0) {
      this.sendChannelMessage('No raids')
      return
    }
    Object.values(this.raidDays).map((raidDay) => this.publishRaid(raidDay))
  }
}
