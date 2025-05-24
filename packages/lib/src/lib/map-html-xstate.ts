import { createActor, emit, setup } from 'xstate'
import { POI } from './geo'

//// shadow DOM actor

// XXX - don't have to keep copy of names here
// XXX - store names in configActor
// XXX - listen on names change & re-render

type RootEvent = { type: 'MOUNT' }
type RootEmit = {
  type: 'RENDER'
}
interface RootContext {
  rendered: boolean
  pointNames: POI[]
  areaNames: POI[]
}

const rootLogic = setup({
  types: {
    events: {} as RootEvent,
    emitted: {} as RootEmit,
    context: {} as RootContext,
  },
}).createMachine({
  id: 'map-html-names-root',
  context: { rendered: false, pointNames: [], areaNames: [] },
  initial: 'Unmounted',
  states: {
    Unmounted: {
      on: {
        MOUNT: {
          actions: emit(() => ({
            type: 'RENDER',
          })),
          target: 'Mounted',
        },
      },
    },
    Mounted: {
      on: {
        MOUNT: {},
        /*
        UPDATE: [
          {
            actions: [
              assign({
                pointNames: ({ event }) => event.pointNames,
                areaNames: ({ event }) => event.areaNames,
              }),
            ],
          },
        ],
        */
      },
    },
  },
})

////

export type RenderCb = () => void

export const renderCbs = new Set<RenderCb>()

////

export const rootActor = createActor(rootLogic, {
  systemId: 'system-root1',
})

rootActor.on('RENDER', () =>
  renderCbs.forEach((cb) => {
    cb()
  })
)

rootActor.start()
