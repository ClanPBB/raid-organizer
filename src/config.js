import {Clan, ClanRepository} from './clan'
import {RaidController, RaidRepository} from './raid'
import {GoogleAuth, SheetsRepository} from './google-sheets'
import {google} from 'googleapis'
require('dotenv').config()

const Discord = require('discord.js')

console.log(process.env) // DEBUG

const googleAuth = new GoogleAuth(
  process.env.SHEETS_CLIENT_SECRET,
  process.env.SHEETS_CLIENT_ID,
  [process.env.SHEETS_REDIRECT_URI],
  process.env.SHEETS_REFRESH_TOKEN
)

export const client = new Discord.Client()

export const config = {
  PBB_BOT_TOKEN: process.env.PBB_BOT_TOKEN,
  PBB_BOT_NAME: process.env.PBB_BOT_NAME,
  SHEET_ACCESS: {
    spreadsheetId: process.env.SHEET_ID
  }
}

export const sheets = google.sheets({
  version: 'v4',
  auth: googleAuth.getAuthorizedClient()
})

const clanRepository = new ClanRepository(
  new SheetsRepository(
    sheets,
    config
  )
)

export const clan = new Clan(
  clanRepository
)

const raidRepository = new RaidRepository(
  new SheetsRepository(
    sheets,
    config
  )
)

export const raid = new RaidController(
  raidRepository,
  client,
  config
)

export const raidChannelName = process.env.RAID_BOT_CHANNEL

export const raidLogChannelName = process.env.RAID_BOT_LOG_CHANNEL
