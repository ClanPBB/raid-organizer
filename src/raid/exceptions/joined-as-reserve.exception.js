import {translations} from '../../locales'
import mustache from 'mustache'

export class JoinedAsReserveException extends Error {
  constructor (username) {
    super(mustache.render(
      translations.ERROR_JOINED_AS_RESERVE,
      {username}
    ))
  }
}
