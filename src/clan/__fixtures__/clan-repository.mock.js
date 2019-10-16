import {dummyData} from './clan-data'

export const clanRepository = {
  async loadMembers () {
    return dummyData.map(currentItem => {
      return {
        id: currentItem[0],
        discord: currentItem[1],
        uplay: currentItem[2]
      }
    })
  },
  async saveMembers (members) {

  }
}
