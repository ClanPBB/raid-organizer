import {translations} from '../../locales'

export class TooManyRunnersException extends Error {
  constructor () {
    super(translations.ERROR_TOO_MANY_RUNNERS)
  }
}
