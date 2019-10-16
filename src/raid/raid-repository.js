import {SHEETS_MAJOR_DIMENSIONS} from '../constants'
import {FIELD_MAP} from './raid-field-map'

const DATA_RANGE = "'RÉD jelentkezés'!B1:K28"

const LIST_SEPARATOR = ', '

export class RaidRepository {
  constructor (sheetsRepository) {
    this.sheetsRepository = sheetsRepository

    this.sheetsRepository.setDataRange(DATA_RANGE)
    this.sheetsRepository.setMajorDimension(SHEETS_MAJOR_DIMENSIONS.COLUMNS)
    this.sheetsRepository.setFieldMap(FIELD_MAP)
  }

  transfromRaidInput (currentItem) {
    if (!currentItem.runners) {
      currentItem.runners = []
    }
    if (!currentItem.reserves) {
      currentItem.reserves = []
    }
    if (!currentItem.runners.push) {
      currentItem.runners = [currentItem.runners]
    }
    if (!currentItem.reserves.push) {
      currentItem.reserves = [currentItem.reserves]
    }
    if (!currentItem.unavailable) {
      currentItem.unavailable = []
    } else {
      currentItem.unavailable = currentItem.unavailable.split(LIST_SEPARATOR)
    }
    if (currentItem.date) {
      currentItem.dateTimestamp = Date.parse(currentItem.date)
    }
    if (currentItem.time) {
      currentItem.timeParsed = Number.parseInt(currentItem.time.replace(':', ''))
    }

    return currentItem
  }

  transfromRaidOutput (currentItem) {
    if (currentItem.unavailable) {
      currentItem.unavailable = currentItem.unavailable.join(LIST_SEPARATOR)
    }
    return currentItem
  }

  async loadRaids () {
    const raids = await this.sheetsRepository.get()
    return raids.map(this.transfromRaidInput)
  }

  async saveRaids (raids) {
    await this.sheetsRepository.save(raids.map(this.transfromRaidOutput))
  }
}
