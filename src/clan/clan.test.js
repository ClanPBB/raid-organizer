import {assert} from 'chai'
import {spy} from 'sinon'
import {Clan} from './'
import {clanRepository} from './__fixtures__/clan-repository.mock'
import {dummyDataCount} from './__fixtures__/clan-data'

describe('Clan', () => {
  it('loadMembers work', async () => {
    const clan = new Clan(
      clanRepository
    )
    await clan.loadMembers()
  
    assert.equal(dummyDataCount, Object.values(clan.members).length)
    assert.equal(dummyDataCount - 1, Object.values(clan.membersById).length) // Items with empty Discord ID are ignored
    assert.isTrue(clan.members.hasOwnProperty('alan'))
    assert.isFalse(clan.members.hasOwnProperty('Alan'))
    assert.isTrue(clan.membersById.hasOwnProperty('3'))
    assert.isFalse(clan.membersById.hasOwnProperty('2'))
  })
  it('update member creates new member if previously unknown', () => {
    const newMember = {
      id: 7,
      discord: 'Dezső'
    }

    clanRepository.saveMembers = spy()
    const clan = new Clan(
      clanRepository
    )
    const expectedData = {
      ...clan.members,
      'dezső': {
        ...newMember
      }
    }

    clan.validateDiscordName(newMember.id, newMember.discord)

    assert.isTrue(clan.members.hasOwnProperty('dezső'))
    assert.isTrue(clan.membersById.hasOwnProperty('7')) // It works with integer as well, please use string when possible...

    assert.isTrue(clanRepository.saveMembers.called)
    assert.deepEqual(expectedData, clanRepository.saveMembers.args[0][0])
  })
  it('validateDiscordName called without arguments', () => {
    const clan = new Clan(
      clanRepository
    )

    assert.throws(clan.validateDiscordName, 'ID_AND_DISCORDNAME_REQUIRED')
  })
})
