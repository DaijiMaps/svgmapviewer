import { useSelector } from '@xstate/react'
import {
  assign,
  createActor,
  emit,
  fromPromise,
  setup,
  type DoneActorEvent,
  type ErrorActorEvent,
} from 'xstate'

import { actionCbs } from '../event-action'
import { getGeolocationPosition, startWatching, stopWatching } from './api'

const TIMEOUT = 5000
const ACCURACY_TIMEOUT = 30000

export type PositionContext = {
  watchID: null | number
  position: null | GeolocationPosition
  error: null | GeolocationPositionError
}

export type PositionEvent =
  | { type: 'GET' }
  | { type: 'WATCH' }
  | { type: 'WATCH.SUCCESS'; position: GeolocationPosition }
  | { type: 'WATCH.ERROR'; error: GeolocationPositionError }
  | { type: 'STOP' }
export type PositionEmitted = {
  type: 'POSITION'
  position: GeolocationPosition
}

const positionMachine = setup({
  types: {
    events: {} as PositionEvent,
    emitted: {} as PositionEmitted,
  },
  actors: {
    api: fromPromise(() => getGeolocationPosition(TIMEOUT)),
    start: fromPromise(() =>
      startWatching(sendSuccess, sendError, ACCURACY_TIMEOUT)
    ),
    stop: fromPromise<void, number>(({ input }) => stopWatching(input)),
  },
  guards: {
    isAccurate: ({ context }) => (context.position?.coords.accuracy ?? 100) < 5,
  },
  delays: {
    TIMEOUT: TIMEOUT,
    ACCURACY_TIMEOUT: ACCURACY_TIMEOUT,
  },
}).createMachine({
  id: 'position',
  context: {
    watchID: null,
    position: null,
    error: null,
  },
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        GET: {
          target: 'Getting',
        },
        WATCH: {
          target: 'Starting',
        },
      },
    },
    Starting: {
      invoke: {
        src: 'start',
        onDone: {
          actions: [
            assign({
              watchID: ({ event }: { event: DoneActorEvent<number> }) =>
                event.output,
            }),
          ],
          target: 'Watching',
        },
      },
    },
    Watching: {
      after: {
        ACCURACY_TIMEOUT: {
          target: 'Stopping',
        },
      },
      on: {
        'WATCH.SUCCESS': {
          actions: assign({
            position: ({ event }) => event.position,
          }),
          target: 'CheckingAccuracy',
        },
        'WATCH.ERROR': {
          actions: assign({
            error: ({ event }) => event.error,
          }),
          target: 'Stopping',
        },
        STOP: {
          target: 'Stopping',
        },
      },
    },
    CheckingAccuracy: {
      always: [
        {
          guard: 'isAccurate',
          target: 'Stopping',
        },
        {
          target: 'Watching',
        },
      ],
    },
    Stopping: {
      invoke: {
        src: 'stop',
        input: ({ context }) => context.watchID,
        onDone: {
          actions: assign({ watchID: null }),
          target: 'Idle',
        },
      },
    },
    Getting: {
      invoke: {
        src: 'api',
        onDone: {
          actions: [
            assign({
              position: ({
                event,
              }: {
                event: DoneActorEvent<GeolocationPosition>
              }) => event.output,
            }),
            emit(({ event }) => ({
              type: 'POSITION',
              position: event.output,
            })),
          ],
          target: 'Idle',
        },
        onError: {
          actions: assign({
            // XXX
            // XXX
            // XXX
            error: ({ event }: { event: ErrorActorEvent }) =>
              JSON.stringify(event),
            // XXX
            // XXX
            // XXX
          }),
          target: 'Retrying',
        },
      },
    },
    Retrying: {
      after: {
        TIMEOUT: {
          target: 'Getting',
        },
      },
    },
  },
})

const positionActor = createActor(positionMachine, {
  inspect: (ev) => console.log(ev),
})

export function positionActorStart(): void {
  positionActor.start()
}

export function positionSend(ev: PositionEvent): void {
  positionActor.send(ev)
}

function sendSuccess(position: GeolocationPosition) {
  positionSend({ type: 'WATCH.SUCCESS', position })
}
function sendError(error: GeolocationPositionError) {
  positionSend({ type: 'WATCH.ERROR', error })
}
export function usePosition(): null | GeolocationPosition {
  return useSelector(positionActor, (state) => state.context.position)
}

export function positionCbsStart(): void {
  actionCbs.position.add(() => positionSend({ type: 'WATCH' }))
}
