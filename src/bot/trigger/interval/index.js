const INTERVAL_MULTIPLIER = 1000

export class IntervalTrigger {
  addInterval (interval, handler) {
    setInterval(() => handler.handle.apply(handler), interval * INTERVAL_MULTIPLIER)
  }
}
