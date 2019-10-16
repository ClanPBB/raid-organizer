import mustache from 'mustache'
import {translations} from '../locales'
import {RichEmbed} from 'discord.js'
import {REGIONAL_REACTIONS, KEYCAP_REACTIONS} from '../constants'

const REGIONAL_REACTIONS_CODE = Object.keys(REGIONAL_REACTIONS)
const KEYCAP_REACTIONS_CODE = Object.keys(KEYCAP_REACTIONS)

const RAID_TYPE_ICONS = {
  speed: ':rocket:',
  kulcs: ':key:',
  default: ':grey_question:'
}

const EMBED_COLOR = '#ff66cc'

export const generateTitle = function (
  raidDay,
  today = new Date().setHours(0, 0, 0, 0),
  tomorrow = new Date().setHours(24, 0, 0, 0)
) {
  const todayBit = (today.valueOf() === raidDay.getKey()) ? translations.RAID_EMBED_TITLE_TODAY : ''
  const tomorrowBit = (tomorrow.valueOf() === raidDay.getKey()) ? translations.RAID_EMBED_TITLE_TOMORROW : ''
  return `${raidDay.date} - ${raidDay.day} ${todayBit}${tomorrowBit}`
}

export const getRaidKeyFromMessage = function (message) {
  const embed = new RichEmbed(message.embeds[0])
  if (!embed || !embed.title) {
    return
  }
  return Date.parse(embed.title.substring(0, embed.title.indexOf('-')))
}

export const createEmbed = function (
  raidDay,
  today = new Date().setHours(0, 0, 0, 0),
  tomorrow = new Date().setHours(24, 0, 0, 0)
) {
  const embed = new RichEmbed()
    .setTitle(generateTitle(raidDay, today, tomorrow))
    .setColor(EMBED_COLOR)

  raidDay.raids.map((raid, index) => {
    embed.addField(mustache.render(
      translations.RAID_EMBED_TITLE,
      {
        ...raid,
        type: RAID_TYPE_ICONS[raid.type] || RAID_TYPE_ICONS.default
      }
    ),
    mustache.render(
      translations.RAID_EMBED_BODY,
      {
        ...raid,
        voteGoing: REGIONAL_REACTIONS_CODE[index],
        voteMaybe: KEYCAP_REACTIONS_CODE[index + 1],
        runnersFlat: raid.runners.map(currentRunner => `__**${currentRunner}**__`).join(' ') || '\u200b',
        runnerCount: raid.runners.length,
        reservesFlat: raid.reserves.join(' ') || '\u200b',
        unavailableFlat: raidDay.unavailable.join(' ') || '\u200b'
      }
    ),
    false)
  })
  embed.addField(
    '\u200b',
    mustache.render(
      translations.RAID_EMBED_UNAVAILABLE,
      {
        unavailableFlat: raidDay.unavailable.join(' ') || '\u200b'
      }
    ),
    false
  )
  return embed
}
