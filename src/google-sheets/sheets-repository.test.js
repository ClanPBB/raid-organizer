import {assert} from 'chai'
import {spy} from 'sinon'
import {SheetsRepository} from './'
import {sheetsApi} from './__fixtures__/sheets-api.mock'
import {dummyDataCount} from './__fixtures__/dummy-data'

describe('Sheets Repostiory', () => {
  it('get works, and empty values are ignored', async () => {
    const repository = new SheetsRepository(
      sheetsApi
    )
    repository.setDataRange('THISISATEST')
    repository.setFieldMap([
      'a',
      'b',
      'c'
    ])

    const result = await repository.get()
  
    const expectedData = [
      {a: '1', b: 'Alan', c: 'Admiral'},
      {b: 'Bob', c: 'Burger'},
      {a: '3', b: 'Clyde', c: 'Clever'}
    ]

    assert.equal(dummyDataCount, result.length)
    assert.deepEqual(expectedData, result)
  })
  it('get works with complex field map', async () => {
    const repository = new SheetsRepository(
      sheetsApi
    )
    repository.setDataRange('THISISATEST')
    repository.setFieldMap([
      {
        name: 'a'
      },
      {
        name: 'b',
        writeProtected: true
      },
      {
        name: 'c'
      }
    ])

    const result = await repository.get()
  
    const expectedData = [
      {a: '1', b: 'Alan', c: 'Admiral'},
      {b: 'Bob', c: 'Burger'},
      {a: '3', b: 'Clyde', c: 'Clever'}
    ]

    assert.equal(dummyDataCount, result.length)
    assert.deepEqual(expectedData, result)
  })
  it('get works, can create an array', async () => {
    const repository = new SheetsRepository(
      sheetsApi
    )
    repository.setDataRange('THISISATEST')
    repository.setFieldMap([
      'a',
      'a',
      'c'
    ])

    const result = await repository.get()
  
    const expectedData = [
      {a: ['1', 'Alan'], c: 'Admiral'},
      {a: 'Bob', c: 'Burger'},
      {a: ['3', 'Clyde'], c: 'Clever'}
    ]

    assert.equal(dummyDataCount, result.length)
    assert.deepEqual(expectedData, result)
  })
  it('can ignore field', async () => {
    const repository = new SheetsRepository(
      sheetsApi
    )
    repository.setDataRange('THISISATEST')
    repository.setFieldMap([
      'a',
      null,
      'c'
    ])

    const result = await repository.get()
  
    const expectedData = [
      {a: '1', c: 'Admiral'},
      {c: 'Burger'},
      {a: '3', c: 'Clever'}
    ]

    assert.equal(dummyDataCount, result.length)
    assert.deepEqual(expectedData, result)
  })
  it('Setting the Major dimension works', () => {
    const repository = new SheetsRepository(
      sheetsApi
    )

    const expected = 'COLUMNS'

    repository.setMajorDimension(expected)
    assert.equal(expected, repository.majorDimension)
  })
  it('Setting the Major dimension only works with proper constants', () => {
    const repository = new SheetsRepository(
      sheetsApi
    )

    const expected = 'ROWS'

    repository.setMajorDimension('THISISNOTVALID')
    assert.equal(expected, repository.majorDimension)
  })
  it('Setting the user input type works', () => {
    const repository = new SheetsRepository(
      sheetsApi
    )

    const expected = 'RAW'

    repository.setValueInputOption(expected)
    assert.equal(expected, repository.valueInputOption)
  })
  it('Setting the user input type only works with proper constants', () => {
    const repository = new SheetsRepository(
      sheetsApi
    )

    const expected = 'USER_ENTERED'

    repository.setValueInputOption('THISISNOTVALID')
    assert.equal(expected, repository.valueInputOption)
  })
  it('save transforms back to the proper format', () => {
    const repository = new SheetsRepository(
      sheetsApi
    )
    repository.setDataRange('THISISATEST')
    repository.setFieldMap([
      'a',
      'b',
      'c'
    ])

    const testObject = {
      test: {
        b: 2,
        c: 3,
        a: 1
      }
    }

    const expectedData = [
      [1, 2, 3]
    ]

    sheetsApi.spreadsheets.values.update = spy()

    repository.save(testObject)
  
    assert.isTrue(sheetsApi.spreadsheets.values.update.called)

    assert.deepEqual(expectedData, sheetsApi.spreadsheets.values.update.args[0][0].resource.values)
  })
  it('Ignored fields are not updated (null)', () => {
    const repository = new SheetsRepository(
      sheetsApi
    )
    repository.setDataRange('THISISATEST')
    repository.setFieldMap([
      'a',
      null,
      'c'
    ])

    const testObject = {
      test: {
        c: 3,
        b: 'ignored',
        a: 1
      }
    }

    const expectedData = [
      [1, null, 3]
    ]

    sheetsApi.spreadsheets.values.update = spy()

    repository.save(testObject)
  
    assert.isTrue(sheetsApi.spreadsheets.values.update.called)

    assert.deepEqual(expectedData, sheetsApi.spreadsheets.values.update.args[0][0].resource.values)
  })
  it('Write protected fields are not updated (null)', () => {
    const repository = new SheetsRepository(
      sheetsApi
    )
    repository.setDataRange('THISISATEST')
    repository.setFieldMap([
      'a',
      {
        name: 'b',
        writeProtected: true
      },
      'c'
    ])

    const testObject = {
      test: {
        c: 3,
        b: 'ignored',
        a: 1
      }
    }

    const expectedData = [
      [1, null, 3]
    ]

    sheetsApi.spreadsheets.values.update = spy()

    repository.save(testObject)
  
    assert.isTrue(sheetsApi.spreadsheets.values.update.called)

    assert.deepEqual(expectedData, sheetsApi.spreadsheets.values.update.args[0][0].resource.values)
  })
  it('Saving when majorDimension is COLUMNS transposes the load', () => {
    const repository = new SheetsRepository(
      sheetsApi
    )
    repository.setDataRange('THISISATEST')
    repository.setMajorDimension('COLUMNS')
    repository.setFieldMap([
      'a',
      null,
      'c'
    ])

    const testObject = {
      test: {
        c: 3,
        b: 'ignored',
        a: 1
      },
      test2: {
        c: 'A',
        b: 'ignored',
        a: 'B'
      },
      test3: {
        c: '!',
        b: 'ignored',
        a: '?'
      }
    }

    const expectedData = [
      [1, 'B', '?'],
      [null, null, null],
      [3, 'A', '!']
    ]

    sheetsApi.spreadsheets.values.update = spy()

    repository.save(testObject)
  
    assert.isTrue(sheetsApi.spreadsheets.values.update.called)

    assert.deepEqual(expectedData, sheetsApi.spreadsheets.values.update.args[0][0].resource.values)
  })
  it('Saving arrays maps to the available fields', () => {
    const repository = new SheetsRepository(
      sheetsApi
    )
    repository.setDataRange('THISISATEST')
    repository.setFieldMap([
      'a',
      'a',
      'a'
    ])

    const testObject = {
      test: {
        a: [
          3,
          5,
          1
        ]
      },
      test2: {
        a: [
          'A',
          'G',
          'B',
          'X',
          'Z'
        ]
      },
      test3: {
        a: [
          '!',
          '?'
        ]
      },
      test4: {
        a: []
      },
      test5: {
      }
    }

    const expectedData = [
      [3, 5, 1],
      ['A', 'G', 'B'],
      ['!', '?', ''],
      ['', '', ''],
      ['', '', '']
    ]

    sheetsApi.spreadsheets.values.update = spy()

    repository.save(testObject)
  
    assert.isTrue(sheetsApi.spreadsheets.values.update.called)

    assert.deepEqual(expectedData, sheetsApi.spreadsheets.values.update.args[0][0].resource.values)
  })
})
