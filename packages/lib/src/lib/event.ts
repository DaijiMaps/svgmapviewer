import { ActorRefFrom, assign, emit, setup } from 'xstate'

type TimeoutContext = {
  ev: null | Event
}
type TimeoutEvent =
  | {
      type: 'TICK'
      ev: Event
    }
  | {
      type: 'START'
    }
  | {
      type: 'STOP'
    }
type TimeoutEmit = {
  type: 'EXPIRED'
  ev: Event
}

export const timeoutMachine = setup({
  types: {
    context: {} as TimeoutContext,
    events: {} as TimeoutEvent,
    emitted: {} as TimeoutEmit,
  },
  delays: {
    EXPIRATION: 2000,
  },
}).createMachine({
  id: 'timeout1',
  initial: 'Stopped',
  context: { ev: null },
  states: {
    Stopped: {
      id: 'timeout-stopped',
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
        TICK: {
          // update - re-entry
          target: 'Updating',
        },
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
