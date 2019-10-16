import {dummyData} from './dummy-data'

export const sheetsApi = {
  spreadsheets: {
    values: {
      get: (request, callback) => {
        callback(null, {
          data: {
            values: dummyData
          }
        })
      }
    }
  }
}
