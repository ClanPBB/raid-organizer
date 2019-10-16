export const translations = {
  /* ERRORS */
  ERROR_CHANNEL_INFO_MISSING: 'Nem ismert a csatorna amire válaszolni kell.',
  ERROR_JOINED_AS_RESERVE: '**{{username}}** Már jelentkeztél tartaléknak, előbb jelentkezz le onnan!',
  ERROR_JOINED_AS_RUNNER: '**{{username}}** Már jelentkeztél mint biztos résztvevő, ha csak tartalékként jössz, előbb jelentkezz le onnan!',
  ERROR_RAID_NOT_FOUND: 'Nem létezik a raid: raid nap *{{key}}*, index *{{index}}*',
  ERROR_TOO_MANY_RUNNERS: 'Betelt a raid',
  ERROR_USERNAME_NOT_LISTED: '**{{username}}** Nem sikerült lejelentkezni a *{{list}}* listáról, mert nem szerepelsz rajta*',

  /* HELP */
  HELP_GET_HELP: 'Előhozza ezt a help üzenetet',
  HELP_WHOIS: 'Megmuatja a discord felhasználó Uplay nevét, amennyiben fent van a Google Sheetben. Használata: [discordName1] [discordName2] ... [discordNameN] (Működik @mentionnel is)',
  HELP_WHOAMI: 'Megmondja az adott userről, hogy fent van a listában a uplay neve.',
  HELP_IAM: 'Adott discord userhez hozzárendel egy uplay nevet. Használata: [uplayTag]',
  HELP_REFRESH_CLAN: 'Frissíti a discord tagok nevét',
  HELP_REFRESH_RAID: 'A látható raidek adatait frissíti (Ha törölve lett egy raid azt nem tölti újra)',
  HELP_RELOAD_RAID: 'Újratölti a raideket a raid jelentkező csatornában',
  HELP_READ_REACTIONS: 'Megnézi van-e változás a jelentkezésekben',

  /* DISCORD MESSAGES */
  MESSAGE_HELP:
`{{#commands}}
\`{{command}}\` {{text}}
{{/commands}}`,
  MESSAGE_WHOIS:
`{{#clan}}
*{{discord}}* => \`{{uplay}}\`
{{/clan}}`,
  CLAN_REFRESHED: 'Klán tagok frissítve',
  IAM_MISSING_TAG: 'Nem adtál meg nevet. A parancs után egy szóközzel írd be a uplay neved.',
  IAM_TAG_UPDATED: 'Uplay név frissítve. *{{discord}}* => `{{uplay}}`',

  RAID_EMBED_TITLE: `{{type}} {{time}}`,
  RAID_EMBED_BODY: `{{description}} \n{{voteGoing}} **JÖVÖK ({{runnerCount}})** - {{runnersFlat}} \n\n{{voteMaybe}} TARTALÉK - {{reservesFlat}} \u200b`,
  RAID_EMBED_UNAVAILABLE: `\n\nNem jönnek - {{unavailableFlat}}\u200b`,
  RAID_EMBED_TITLE_TODAY: ':bangbang: **MA** :bangbang:',
  RAID_EMBED_TITLE_TOMORROW: ':grey_exclamation: HOLNAP :grey_exclamation:',

  JOINED_AS_RUNNER: ':white_check_mark: **{{day}}, {{time}} - {{username}}** - {{date}}, jelentkezett',
  LEFT_AS_RUNNER: ':no_entry_sign: **{{day}}, {{time}} - {{username}}** - {{date}}, lejelentkezett',
  JOINED_AS_RESERVE: ':heavy_check_mark: **{{day}}, {{time}} - {{username}}** - {{date}}, tartalék',
  LEFT_AS_RESERVE: ':heavy_multiplication_x: **{{day}}, {{time}} - {{username}}** - {{date}}, nem tartalék',

  /* DEBUG */
  INFO_BOT_CONNECTION: 'Connecting to BOT.',

  /* OTHER STUFF */
  CLAN_UNKNOWN_MEMBER: '[Ismeretlen tag]'
}
