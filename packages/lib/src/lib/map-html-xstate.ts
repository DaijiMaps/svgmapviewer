import { ReactNode } from 'react'
import { assign, createActor, emit, setup } from 'xstate'
import { MapHtml } from '../MapHtml'
import { POI } from './geo'

//// shadow DOM actor

// XXX - don't have to keep copy of names here
// XXX - store names in configActor
// XXX - listen on names change & re-render

type RootEvent =
  | { type: 'MOUNT' }
  | { type: 'UPDATE'; pointNames: POI[]; areaNames: POI[] }
type RootEmit = {
  type: 'RENDER'
  pointNames: POI[]
  areaNames: POI[]
}
interface RootContext {
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
  context: { pointNames: [], areaNames: [] },
  on: {
    MOUNT: {},
    UPDATE: [
      {
        actions: [
          assign({
            pointNames: ({ event }) => event.pointNames,
            areaNames: ({ event }) => event.areaNames,
          }),
          emit(({ event }) => ({
            type: 'RENDER',
            pointNames: event.pointNames,
            areaNames: event.areaNames,
          })),
        ],
      },
    ],
  },
})

////

export type RenderCb = (children: ReactNode) => void

export const renderCbs = new Set<RenderCb>()

export const rootActor = createActor(rootLogic)

rootActor.on('RENDER', ({ pointNames, areaNames }) =>
  renderCbs.forEach((cb) => cb(MapHtml(pointNames, areaNames)))
)

rootActor.start()
