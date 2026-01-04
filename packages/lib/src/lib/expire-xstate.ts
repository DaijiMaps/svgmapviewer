import { assign, createActor, emit, setup } from 'xstate'

import type { Cb } from './cb'

type Events = { type: 'TICK' }
type Emitted = { type: 'EXPIRE' }
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
    expire: emit({ type: 'EXPIRE' }),
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
      after: { DURATION: { actions: ['expire', 'clear'], target: 'Idle' } },
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
      always: { actions: ['expire', 'clear'], target: 'Idle' },
    },
  },
})

export interface Expire {
  tick: Cb
}

export function makeExpire(duration: number, cb: Cb): Expire {
  const machine = expireMachine.provide({
    delays: {
      DURATION: duration,
    },
  })
  const actor = createActor(machine)
  actor.on('EXPIRE', cb)
  actor.start()
  function tick() {
    actor.send({ type: 'TICK' })
  }
  return {
    tick,
  }
}
