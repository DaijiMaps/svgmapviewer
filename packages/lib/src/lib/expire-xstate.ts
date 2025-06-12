import { assign, createActor, emit, setup } from 'xstate'

export type ExpireEvent = { timeStamp: number }

type Events = { type: 'TICK'; ev: ExpireEvent }
type Emitted = { type: 'CALL' }
type Context = { ticked: boolean }

const expireMachine = setup({
  types: {
    events: {} as Events,
    emitted: {} as Emitted,
    context: {} as Context,
  },
  actions: {
    clear: assign({ ticked: false }),
    set: assign({ ticked: true }),
    call: emit({ type: 'CALL' }),
  },
  delays: {
    DURATION: 500,
  },
}).createMachine({
  id: 'expire1',
  context: { ticked: false },
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        TICK: { target: 'Empty' },
      },
    },
    Empty: {
      after: { DURATION: { actions: ['call', 'clear'], target: 'Idle' } },
      on: {
        TICK: {
          guard: ({ context }) => !context.ticked,
          actions: { type: 'set', params: ({ event }) => event },
          target: 'Active',
        },
      },
    },
    Active: {
      after: { DURATION: { target: 'Expired' } },
      on: {
        TICK: {
          actions: { type: 'set', params: ({ event }) => event },
          target: 'Restarting',
        },
      },
    },
    Restarting: { always: 'Active' },
    Expired: {
      always: { actions: ['call', 'clear'], target: 'Idle' },
    },
  },
})

export interface Expire {
  machine: unknown
  actor: unknown
  start: () => void
  tick: (ev: ExpireEvent) => void
}

export function makeExpire(duration: number, cb: () => void): Expire {
  const machine = expireMachine.provide({
    delays: {
      DURATION: duration,
    },
  })
  const actor = createActor(machine)
  actor.on('CALL', cb)
  function start() {
    actor.start()
  }
  function tick(ev: ExpireEvent) {
    actor.send({ type: 'TICK', ev })
  }
  return {
    machine,
    actor,
    start,
    tick,
  }
}
