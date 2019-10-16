import {
  SHEETS_MAJOR_DIMENSIONS,
  SHEETS_VALUE_INPUT_OPTIONS
} from '../constants'

export class SheetsRepository {
  constructor (
    sheetsApi,
    config = {}
  ) {
    this.sheetsApi = sheetsApi
    this.config = config
    this.dataRange = ''
    this.fieldMap = []
    this.majorDimension = SHEETS_MAJOR_DIMENSIONS.ROWS
    this.valueInputOption = SHEETS_VALUE_INPUT_OPTIONS.USER_ENTERED
  }

  setDataRange (dataRange) {
    this.dataRange = dataRange
  }

  setFieldMap (fieldMap) {
    this.fieldMap = fieldMap.map(currentField => {
      return {
        writeProtected: currentField && currentField.writeProtected,
        name: currentField && currentField.hasOwnProperty('name')
          ? currentField.name
          : currentField
      }
    })
  }

  setValueInputOption (valueInputOption) {
    if (!SHEETS_VALUE_INPUT_OPTIONS.hasOwnProperty(valueInputOption)) {
      return
    }
    this.valueInputOption = valueInputOption
  }

  setMajorDimension (majorDimension) {
    if (!SHEETS_MAJOR_DIMENSIONS.hasOwnProperty(majorDimension)) {
      return
    }
    this.majorDimension = majorDimension
  }

  async get (
    range = this.dataRange,
    majorDimension = this.majorDimension,
    fieldMap = this.fieldMap
  ) {
    if (range === '') {
      console.error('Invalid range')
      return
    }

    const request = {
      range,
      majorDimension,
      ...this.config.SHEET_ACCESS
    }

    return new Promise((resolve, reject) => {
      this.sheetsApi.spreadsheets.values.get(request, (err, response) => {
        if (err) {
          reject(err)
        } else {
          resolve(this.parseDataResponse(response, fieldMap))
        }
      })
    })
  }

  parseDataResponse (
    response,
    fieldMap = this.fieldMap
  ) {
    const data = response && response.data && response.data.values

    if (!data) {
      return []
    }

    const dataMapped = data.map(currentItem => Object.values(fieldMap).reduce((aggregator, field, fieldIndex) => {
      if (!field.name || !currentItem[fieldIndex]) {
        return aggregator
      }
      if (!aggregator[field.name]) {
        aggregator[field.name] = currentItem[fieldIndex] || ''
        return aggregator
      }
      if (!aggregator[field.name].push) {
        aggregator[field.name] = [
          aggregator[field.name], // only works for primitives, arrays or objects create a recursive array
          currentItem[fieldIndex]
        ]
      } else {
        aggregator[field.name].push(currentItem[fieldIndex])
      }
      return aggregator
    }, {}))
    return dataMapped
  }

  transpose (aggregator, currentItem) {
    currentItem.map((internalItem, internalIndex) => {
      if (!aggregator[internalIndex]) {
        aggregator[internalIndex] = []
      }
      aggregator[internalIndex].push(internalItem)
    })
    return aggregator
  }

  async save (
    data,
    range = this.dataRange,
    fieldMap = this.fieldMap,
    valueInputOption = this.valueInputOption
  ) {
    data = JSON.parse(JSON.stringify(data)) // making sure it is a deep copy
    let values = Object.values(data).map((currentItem) => Object.values(fieldMap).map(field => {
      if (!field.name ||
        field.writeProtected) {
        return null
      }
      if (!currentItem[field.name]) {
        return ''
      }
      if (currentItem[field.name].shift) {
        return currentItem[field.name].shift() || ''
      }
      
      return currentItem[field.name]
    }))

    if (values.length === 0) {
      return
    }
    if (this.majorDimension === SHEETS_MAJOR_DIMENSIONS.COLUMNS) {
      values = values.reduce(this.transpose, [])
    }

    const request = {
      range,
      valueInputOption,
      resource: {
        values
      },
      ...this.config.SHEET_ACCESS
    }

    return new Promise((resolve, reject) => {
      this.sheetsApi.spreadsheets.values.update(request, (err, response) => {
        if (err) {
          reject(err)
        } else {
          resolve(this.parseDataResponse(response, fieldMap))
        }
      })
    })
  }

  parseActionResponse (response, fieldMap) {
    return true
  }
}
