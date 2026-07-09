import { getCurrentScope, onScopeDispose } from 'vue'

export type EmitterName = string | symbol
export type EmitterEvents = {
  [key: string]: unknown[]
  [key: symbol]: unknown[]
}
export type EmitterListener<Args extends unknown[]> = (...args: Args) => void | Promise<void>
export type EmitterOff = () => void

type EventKey<Events extends object> = Extract<keyof Events, EmitterName>
type EventArgs<Events extends object, Name extends EventKey<Events>> = Events[Name] extends unknown[]
  ? Events[Name]
  : never
type InternalListener = (...args: unknown[]) => void | Promise<void>
type ListenerEntry = {
  fn: InternalListener
  once: boolean
}

export class Emitter<Events extends object = EmitterEvents> {
  readonly name?: EmitterName

  private events = new Map<EmitterName, ListenerEntry | ListenerEntry[]>()

  constructor(name?: EmitterName) {
    this.name = name
  }

  on<Name extends EventKey<Events>>(name: Name, listener: EmitterListener<EventArgs<Events, Name>>): EmitterOff {
    const entry: ListenerEntry = {
      fn: listener as InternalListener,
      once: false,
    }

    this.addEntry(name, entry)

    return () => {
      this.removeEntry(name, entry)
    }
  }

  once<Name extends EventKey<Events>>(name: Name, listener: EmitterListener<EventArgs<Events, Name>>): EmitterOff {
    const entry: ListenerEntry = {
      fn: ((...args: unknown[]) => {
        this.removeEntry(name, entry)
        return (listener as InternalListener)(...args)
      }) as InternalListener,
      once: true,
    }

    this.addEntry(name, entry)

    return () => {
      this.removeEntry(name, entry)
    }
  }

  off<Name extends EventKey<Events>>(name: Name, listener?: EmitterListener<EventArgs<Events, Name>>): void {
    if (!listener) {
      this.events.delete(name)
      return
    }

    this.removeListener(name, listener as InternalListener)
  }

  emit<Name extends EventKey<Events>>(name: Name, ...args: EventArgs<Events, Name>): boolean {
    const current = this.events.get(name)
    if (!current) return false

    if (!Array.isArray(current)) {
      this.callEntry(name, current, args)
      return true
    }

    const length = current.length
    for (let i = 0; i < length; i++) {
      this.callEntry(name, current[i], args)
    }

    return true
  }

  async emitAsync<Name extends EventKey<Events>>(name: Name, ...args: EventArgs<Events, Name>): Promise<boolean> {
    const current = this.events.get(name)
    if (!current) return false

    const entries = Array.isArray(current) ? current.slice() : [current]
    const results = await Promise.allSettled(entries.map((entry) => this.callEntryAsync(name, entry, args)))
    const errors = results
      .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      .map((result) => result.reason)

    if (errors.length > 0) {
      throw new AggregateError(errors, 'One or more emitter listeners failed')
    }

    return true
  }

  clear<Name extends EventKey<Events>>(name: Name): void {
    this.events.delete(name)
  }

  count<Name extends EventKey<Events>>(name: Name): number {
    const current = this.events.get(name)
    if (!current) return 0
    return Array.isArray(current) ? current.length : 1
  }

  private addEntry(name: EmitterName, entry: ListenerEntry): void {
    const current = this.events.get(name)

    if (!current) {
      this.events.set(name, entry)
      return
    }

    if (Array.isArray(current)) {
      current.push(entry)
      return
    }

    this.events.set(name, [current, entry])
  }

  private removeEntry(name: EmitterName, entry: ListenerEntry): void {
    const current = this.events.get(name)
    if (!current) return

    if (!Array.isArray(current)) {
      if (current === entry) this.events.delete(name)
      return
    }

    const index = current.indexOf(entry)
    if (index === -1) return

    const next = current.slice(0, index).concat(current.slice(index + 1))
    this.setEntries(name, next)
  }

  private removeListener(name: EmitterName, listener: InternalListener): void {
    const current = this.events.get(name)
    if (!current) return

    if (!Array.isArray(current)) {
      if (current.fn === listener) this.events.delete(name)
      return
    }

    this.setEntries(
      name,
      current.filter((entry) => entry.fn !== listener),
    )
  }

  private setEntries(name: EmitterName, entries: ListenerEntry[]): void {
    if (entries.length === 0) {
      this.events.delete(name)
      return
    }

    this.events.set(name, entries.length === 1 ? entries[0] : entries)
  }

  private callEntry(name: EmitterName, entry: ListenerEntry, args: unknown[]): void {
    if (entry.once) this.removeEntry(name, entry)
    callListener(entry.fn, args)
  }

  private async callEntryAsync(name: EmitterName, entry: ListenerEntry, args: unknown[]): Promise<void> {
    if (entry.once) this.removeEntry(name, entry)
    await callListenerAsync(entry.fn, args)
  }
}

export type EmitterApi<Events extends object = EmitterEvents> = Pick<
  Emitter<Events>,
  'clear' | 'count' | 'emit' | 'emitAsync' | 'off' | 'on' | 'once'
>

const emitters = new Map<EmitterName, Emitter<EmitterEvents>>()

export const emitter = new Emitter<EmitterEvents>()

export function createEmitter<Events extends object = EmitterEvents>(): Emitter<Events>
export function createEmitter<Events extends object = EmitterEvents>(name: EmitterName): Emitter<Events>
export function createEmitter<Events extends object = EmitterEvents>(name?: EmitterName): Emitter<Events> {
  if (name === undefined) return new Emitter<Events>()

  if (emitters.has(name)) {
    throw new Error(`Emitter "${String(name)}" already exists`)
  }

  const created = new Emitter<Events>(name)
  emitters.set(name, created as unknown as Emitter<EmitterEvents>)
  return created
}

export function useEmitter<Events extends object = EmitterEvents>(): EmitterApi<Events>
export function useEmitter<Events extends object = EmitterEvents>(name: EmitterName): EmitterApi<Events>
export function useEmitter<Events extends object = EmitterEvents>(name?: EmitterName): EmitterApi<Events> {
  const target = getEmitterForUse<Events>(name)
  const disposers = new Set<EmitterOff>()
  const hasScope = Boolean(getCurrentScope())

  if (!hasScope) {
    throw new Error('useEmitter() must be called inside a Vue setup or effect scope')
  }

  onScopeDispose(() => {
    disposers.forEach((dispose) => dispose())
    disposers.clear()
  })

  const track = (dispose: EmitterOff): EmitterOff => {
    disposers.add(dispose)
    return () => {
      disposers.delete(dispose)
      dispose()
    }
  }

  return {
    emit: target.emit.bind(target),
    emitAsync: target.emitAsync.bind(target),
    on: ((eventName: EventKey<Events>, listener: EmitterListener<EventArgs<Events, EventKey<Events>>>) =>
      track(target.on(eventName, listener))) as Emitter<Events>['on'],
    once: ((eventName: EventKey<Events>, listener: EmitterListener<EventArgs<Events, EventKey<Events>>>) =>
      track(target.once(eventName, listener))) as Emitter<Events>['once'],
    off: target.off.bind(target),
    clear: target.clear.bind(target),
    count: target.count.bind(target),
  }
}

function getEmitterForUse<Events extends object>(name?: EmitterName): Emitter<Events> {
  if (name === undefined) return emitter as unknown as Emitter<Events>

  const target = emitters.get(name)
  if (!target) {
    throw new Error(`Emitter "${String(name)}" does not exist`)
  }

  return target as unknown as Emitter<Events>
}

function callListener(listener: InternalListener, args: unknown[]): void {
  switch (args.length) {
    case 0:
      listener()
      break
    case 1:
      listener(args[0])
      break
    case 2:
      listener(args[0], args[1])
      break
    case 3:
      listener(args[0], args[1], args[2])
      break
    default:
      listener(...args)
  }
}

async function callListenerAsync(listener: InternalListener, args: unknown[]): Promise<void> {
  switch (args.length) {
    case 0:
      await listener()
      break
    case 1:
      await listener(args[0])
      break
    case 2:
      await listener(args[0], args[1])
      break
    case 3:
      await listener(args[0], args[1], args[2])
      break
    default:
      await listener(...args)
  }
}
