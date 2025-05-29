import { useSelector } from '@xstate/react'
import {
  assign,
  createActor,
  emit,
  fromPromise,
  setup,
  type DoneActorEvent,
} from 'xstate'

export type GeoLocContext = {
  position: null | GeolocationPosition
  error: null | string
}

export type GeoLocEvent = { type: 'GET' }
export type GeoLocEmitted = { type: 'POSITION'; position: GeolocationPosition }

const geolocMachine = setup({
  types: {
    events: {} as GeoLocEvent,
    emitted: {} as GeoLocEmitted,
  },
  actors: {
    api: fromPromise(async function () {
      return new Promise<GeolocationPosition>((resolve, reject) => {
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
                event: DoneActorEvent<GeolocationPosition, string>
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
            error: () => 'XXX',
          }),
          target: 'Retrying',
        },
      },
    },
    Retrying: {
      after: {
        10000: {
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

export function geolocRequest(): void {
  geolocSend({ type: 'GET' })
}

export function useGeolocPosition(): null | GeolocationPosition {
  return useSelector(geolocActor, (state) => state.context.position)
}
