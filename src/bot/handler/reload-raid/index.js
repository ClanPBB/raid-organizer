import {translations} from '../../../locales'

export class ReloadRaidHandler {
  constructor (raid) {
    this.raid = raid
  }

  help () {
    return translations.HELP_RELOAD_RAID
  }

  async handle (args) {
    await this.raid.checkMessagesForRaids()
    this.raid.loadRaids()
  }
}
