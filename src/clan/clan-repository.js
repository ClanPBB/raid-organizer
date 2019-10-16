const DATA_RANGE = "'Runners'!A2:C100"
const FIELD_MAP = [
  'id',
  'discord',
  'uplay'
]

export class ClanRepository {
  constructor (sheetsRepository) {
    this.sheetsRepository = sheetsRepository

    this.sheetsRepository.setDataRange(DATA_RANGE)
    this.sheetsRepository.setFieldMap(FIELD_MAP)
  }

  async loadMembers () {
    return this.sheetsRepository.get()
  }

  async saveMembers (members) {
    await this.sheetsRepository.save(members)
  }
}
