import {translations} from '../../locales'
import mustache from 'mustache'

export class RaidNotFoundException extends Error {
  constructor (params) {
    super(mustache.render(
      translations.ERROR_RAID_NOT_FOUND,
      params
    ))
  }
}
