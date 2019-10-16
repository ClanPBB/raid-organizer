export class PingHandler {
  constructor (clan) {
    this.clan = clan
  }

  help () {
    return 'A simple ping in the servers console'
  }

  handle (...args) {
    console.log('PONG?')
    console.log(args)
  }
}
