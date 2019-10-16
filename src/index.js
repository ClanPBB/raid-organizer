import {
  client,
  sheets,
  clan,
  config,
  raid,
  raidChannelName,
  raidLogChannelName} from './config'
import {PbbBot} from './bot'
import {
  ServerReadyTrigger,
  CommandTrigger,
  IntervalTrigger
} from './bot/trigger'
import {
  ServerConnectedHandler,
  PingHandler,
  WhoisHandler,
  WhoAmIHandler,
  GetHelpHandler,
  RefreshClanHandler,
  IamHandler,
  GetRaidChannelHandler,
  GetRaidLogChannelHandler,
  RefreshRaidHandler,
  ReloadRaidHandler,
  ReadReactionsHandler
} from './bot/handler'

const getHelpHandler = new GetHelpHandler(client)

const serverReadyTrigger = new ServerReadyTrigger(client)
const commandTrigger = new CommandTrigger(client, getHelpHandler)
const intervalTrigger = new IntervalTrigger()

const serverConnectedHandler = new ServerConnectedHandler()
const pingHandler = new PingHandler(clan)
const whoisHandler = new WhoisHandler(client, clan)
const whoAmIHandler = new WhoAmIHandler(client, clan)
const refreshClanIHandler = new RefreshClanHandler(client, clan)
const iamHandler = new IamHandler(client, clan)
const getRaidChannelHandler = new GetRaidChannelHandler(client, raid, raidChannelName)
const getRaidLogChannelHandler = new GetRaidLogChannelHandler(client, raid, raidLogChannelName)
const refreshRaidHandler = new RefreshRaidHandler(raid)
const reloadRaidHandler = new ReloadRaidHandler(raid)
const readReactionsHandler = new ReadReactionsHandler(raid)

clan.loadMembers()

new PbbBot(
  client,
  sheets,
  clan,
  {
    serverReadyTrigger,
    commandTrigger,
    intervalTrigger
  },
  {
    serverConnectedHandler,
    pingHandler,
    whoisHandler,
    whoAmIHandler,
    refreshClanIHandler,
    iamHandler,
    getRaidChannelHandler,
    getRaidLogChannelHandler,
    refreshRaidHandler,
    reloadRaidHandler,
    readReactionsHandler
  },
  config
).connect()
