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
import { actionCbs } from '../../event'

export type GeoLocContext = {
  position: null | GeolocationPosition
  error: null | GeolocationPositionError
}

export type GeoLocEvent = { type: 'GET' }
export type GeoLocEmitted = { type: 'POSITION'; position: GeolocationPosition }

const TIMEOUT = 5000

async function getGeolocationPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    function successCb(position: GeolocationPosition) {
      resolve(position)
    }
    function errorCb(error: GeolocationPositionError) {
      reject(error)
    }
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: TIMEOUT,
      maximumAge: 0,
    }
    navigator.geolocation.getCurrentPosition(successCb, errorCb, options)
  })
}

const geolocMachine = setup({
  types: {
    events: {} as GeoLocEvent,
    emitted: {} as GeoLocEmitted,
  },
  actors: {
    api: fromPromise(getGeolocationPosition),
  },
  delays: {
    TIMEOUT: TIMEOUT,
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
        TIMEOUT: {
          target: 'Getting',
        },
      },
    },
  },
})

const geolocActor = createActor(geolocMachine)
geolocActorStart()

export function geolocActorStart(): void {
  geolocActor.start()
}

export function geolocSend(ev: GeoLocEvent): void {
  geolocActor.send(ev)
}

export function getPosition(): void {
  geolocSend({ type: 'GET' })
}

export function usePosition(): null | GeolocationPosition {
  return useSelector(geolocActor, (state) => state.context.position)
}

export function positionCbsStart(): void {
  actionCbs.position.add(getPosition)
}
