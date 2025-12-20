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
import { getGeolocationPosition } from './api'

const TIMEOUT = 5000

export type PositionContext = {
  position: null | GeolocationPosition
  error: null | GeolocationPositionError
}

export type PositionEvent = { type: 'GET' }
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
  },
  delays: {
    TIMEOUT: TIMEOUT,
  },
}).createMachine({
  id: 'position',
  context: {
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

const positionActor = createActor(positionMachine)

export function positionActorStart(): void {
  positionActor.start()
}

export function positionSend(ev: PositionEvent): void {
  positionActor.send(ev)
}

export function usePosition(): null | GeolocationPosition {
  return useSelector(positionActor, (state) => state.context.position)
}

export function positionCbsStart(): void {
  actionCbs.position.add(() => positionSend({ type: 'GET' }))
}
