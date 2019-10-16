import {translations} from '../../../locales'

export class ReadReactionsHandler {
  constructor (raid) {
    this.raid = raid
  }

  help () {
    return translations.HELP_READ_REACTIONS
  }

  handle (args) {
    this.raid.readAllReactions()
  }
}
