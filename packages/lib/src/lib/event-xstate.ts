import React from 'react'
import { ActorRefFrom, assign, emit, setup } from 'xstate'

type TimeoutContext = {
  ev: null | React.UIEvent
}
type TimeoutEvent =
  | {
      type: 'TICK'
      ev: React.UIEvent
    }
  | {
      type: 'START'
    }
  | {
      type: 'STOP'
    }
type TimeoutEmit = {
  type: 'EXPIRED'
  ev: React.UIEvent
}

const EXPIRATION = 2000

export const timeoutMachine = setup({
  types: {
    context: {} as TimeoutContext,
    events: {} as TimeoutEvent,
    emitted: {} as TimeoutEmit,
  },
  delays: {
    EXPIRATION,
  },
}).createMachine({
  id: 'timeout1',
  initial: 'Stopped',
  context: { ev: null },
  states: {
    Stopped: {
      on: {
        START: {
          target: 'Inactive',
        },
      },
    },
    Inactive: {
      on: {
        TICK: {
          actions: assign({
            ev: ({ event }) => event.ev,
          }),
          target: 'Active',
        },
        STOP: {
          target: 'Stopped',
        },
      },
    },
    Active: {
      after: {
        EXPIRATION: {
          guard: ({ context }) => context.ev != null,
          actions: emit(({ context }) => ({ type: 'EXPIRED', ev: context.ev })),
          target: 'Inactive',
        },
      },
      on: {
        TICK: [
          {
            guard: ({ context, event }) =>
              context.ev === null ||
              // too frequent -> ignore
              // (hopefully save some CPU time by avoiding timer stop/start too often)
              event.ev.timeStamp - context.ev.timeStamp < EXPIRATION / 10,
          },
          {
            // update - re-entry
            actions: assign({
              ev: ({ event }) => event.ev,
            }),
            target: 'Updating',
          },
        ],
        STOP: {
          target: 'Stopped',
        },
      },
    },
    Updating: {
      always: 'Active',
    },
  },
})

export type TimeoutRef = ActorRefFrom<typeof timeoutMachine>
