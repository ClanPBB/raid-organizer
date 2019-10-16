import {
  UsernameNotListedException,
  JoinedAsReserveException,
  JoinedAsRunnerException
} from './exceptions'

export class Raid {
  constructor (raid) {
    this.id = raid.id
    this.date = raid.date
    this.dateTimestamp = raid.dateTimestamp
    this.day = raid.day
    this.time = raid.time
    this.description = raid.description
    this.type = raid.type
    this.sortOrder = raid.sortOrder || 1000

    this.runners = raid.runners || []
    this.reserves = raid.reserves || []
  }

  getId () {
    return this.id
  }

  addRunner (username) {
    if (this.isReserve(username)) {
      throw new JoinedAsReserveException(username)
    }
    if (this.runners.length > 7) {
      return this.addReserve(username)
    }
    this.runners.push(username)
    return [{
      username,
      id: this.id,
      date: this.date,
      day: this.day,
      time: this.time,
      list: 'runner',
      added: true
    }]
  }

  removeRunner (username) {
    if (!this.isRunner(username)) {
      throw new UsernameNotListedException({
        list: 'runners',
        username
      })
    }
    this.runners.splice(this.runners.indexOf(username), 1)
    return [{
      username,
      id: this.id,
      date: this.date,
      day: this.day,
      time: this.time,
      list: 'runner',
      removed: true
    }]
  }

  isRunner (username) {
    return this.runners.includes(username)
  }

  addReserve (username) {
    if (this.isRunner(username)) {
      throw new JoinedAsRunnerException(username)
    }
    this.reserves.push(username)
    return [{
      username,
      id: this.id,
      date: this.date,
      day: this.day,
      time: this.time,
      list: 'reserve',
      added: true
    }]
  }

  removeReserve (username) {
    if (!this.isReserve(username)) {
      throw new UsernameNotListedException({
        list: 'reserves',
        username
      })
    }
    this.reserves.splice(this.reserves.indexOf(username), 1)
    return [{
      username,
      id: this.id,
      date: this.date,
      day: this.day,
      time: this.time,
      list: 'reserve',
      removed: true
    }]
  }

  isReserve (username) {
    return this.reserves.includes(username)
  }

  toggleRunner (username) {
    return (this.isRunner(username))
      ? this.removeRunner(username)
      : this.addRunner(username)
  }

  getBoundToggleRunner () {
    return (username) => {
      return this.toggleRunner(username)
    }
  }

  conditionalRemoveRunner (username) {
    if (this.isRunner(username)) {
      return this.removeRunner(username)
    }
    return []
  }

  toggleReserve (username) {
    return (this.isReserve(username))
      ? this.removeReserve(username)
      : this.addReserve(username)
  }

  getBoundToggleReserve () {
    return (username) => {
      return this.toggleReserve(username)
    }
  }

  conditionalRemoveReserve (username) {
    if (this.isReserve(username)) {
      return this.removeReserve(username)
    }
    return []
  }
}
