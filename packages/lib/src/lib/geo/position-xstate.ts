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

export type GeoLocContext = {
  position: null | GeolocationPosition
  error: null | GeolocationPositionError
}

export type GeoLocEvent = { type: 'GET' }
export type GeoLocEmitted = { type: 'POSITION'; position: GeolocationPosition }

const geolocMachine = setup({
  types: {
    events: {} as GeoLocEvent,
    emitted: {} as GeoLocEmitted,
  },
  actors: {
    api: fromPromise<GeolocationPosition>(async function () {
      return new Promise((resolve, reject) => {
        const successCb: PositionCallback = (position: GeolocationPosition) => {
          resolve(position)
        }
        const errorCb: PositionErrorCallback = (
          error: GeolocationPositionError
        ) => {
          reject(error)
        }
        const options: PositionOptions = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
        navigator.geolocation.getCurrentPosition(successCb, errorCb, options)
      })
    }),
  },
}).createMachine({
  id: 'geoloc',
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
        5000: {
          target: 'Getting',
        },
      },
    },
  },
})

////

const geolocActor = createActor(geolocMachine)
geolocActorStart()

export function geolocActorStart(): void {
  geolocActor.start()
}

export function geolocSend(ev: GeoLocEvent): void {
  geolocActor.send(ev)
}

////

export function getPosition(): void {
  geolocSend({ type: 'GET' })
}

export function usePosition(): null | GeolocationPosition {
  return useSelector(geolocActor, (state) => state.context.position)
}
