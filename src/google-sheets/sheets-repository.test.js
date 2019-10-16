import {assert} from 'chai'
import {spy} from 'sinon'
import {SheetsRepository} from './'
import {sheetsApi} from './__fixtures__/sheets-api.mock'
import {dummyDataCount} from './__fixtures__/dummy-data'

describe('Sheets Repostiory', () => {
  it('get works', async () => {
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
      {a: '', b: 'Bob', c: 'Burger'},
      {a: '3', b: 'Clyde', c: 'Clever'}
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
      {a: '', c: 'Burger'},
      {a: '3', c: 'Clever'}
    ]

    assert.equal(dummyDataCount, result.length)
    assert.deepEqual(expectedData, result)
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
  it('Ignored fields are added as empty', () => {
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
        a: 1
      }
    }

    const expectedData = [
      [1, '', 3]
    ]

    sheetsApi.spreadsheets.values.update = spy()

    repository.save(testObject)
  
    assert.isTrue(sheetsApi.spreadsheets.values.update.called)

    assert.deepEqual(expectedData, sheetsApi.spreadsheets.values.update.args[0][0].resource.values)
  })
})
