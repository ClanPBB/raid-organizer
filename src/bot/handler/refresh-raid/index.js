import {translations} from '../../../locales'

export class RefreshRaidHandler {
  constructor (raid) {
    this.raid = raid
  }

  help () {
    return translations.HELP_REFRESH_RAID
  }

  handle (args) {
    this.raid.loadRaids()
  }
}
