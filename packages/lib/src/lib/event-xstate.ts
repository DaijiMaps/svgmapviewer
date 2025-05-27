import React from 'react'
import { assign, createActor, emit, setup } from 'xstate'
import { scrolleventmask, viewerSend } from './viewer-xstate'

type TimeoutInput = {
  expiration?: number
}
type TimeoutContext = {
  ev: null | React.UIEvent<HTMLDivElement, Event>
  expiration: number
}
type TimeoutEvent =
  | {
      type: 'TICK'
      ev: React.UIEvent<HTMLDivElement, Event>
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

const DEFAULT_EXPIRATION = 3000

const timeoutMachine = setup({
  types: {
    input: {} as TimeoutInput,
    context: {} as TimeoutContext,
    events: {} as TimeoutEvent,
    emitted: {} as TimeoutEmit,
  },
  delays: {
    EXPIRATION: ({ context }) => context.expiration,
  },
}).createMachine({
  id: 'timeout1',
  initial: 'Stopped',
  context: ({ input }) => ({
    ev: null,
    expiration: input.expiration ?? DEFAULT_EXPIRATION,
  }),
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
              event.ev.timeStamp - context.ev.timeStamp <
                context.expiration / 10,
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

//type TimeoutRef = ActorRefFrom<typeof timeoutMachine>

const scrollTimeoutActor = createActor(timeoutMachine, {
  input: { expiration: 2000 },
})

scrollTimeoutActor.on('EXPIRED', ({ ev }) => {
  if (!scrolleventmask) {
    viewerSend({ type: 'SCROLL', ev })
  }
})
scrollTimeoutActor.start()

export function scrollTimeoutActorStart(): void {
  scrollTimeoutActor.start()
}

export function scrollTimeoutActorSend(ev: TimeoutEvent): void {
  scrollTimeoutActor.send(ev)
}
