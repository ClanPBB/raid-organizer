import {translations} from '../../locales'
import mustache from 'mustache'

export class UsernameNotListedException extends Error {
  constructor (params) {
    super(mustache.render(
      translations.ERROR_USERNAME_NOT_LISTED,
      params
    ))
  }
}
