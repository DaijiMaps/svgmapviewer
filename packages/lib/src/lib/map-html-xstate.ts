import { ReactNode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { assign, createActor, emit, setup } from 'xstate'
import { MapHtmlRoot } from '../MapHtmlRoot'
import { POI } from './geo'
import { useNames } from './names'

//// shadow DOM actor

// XXX - don't have to keep copy of names here
// XXX - store names in configActor
// XXX - listen on names change & re-render

const ROOT_ID = 'map-html-content-root'

type RootEvent =
  | {
      type: 'MOUNT'
    }
  | {
      type: 'UPDATE'
      pointNames: POI[]
      areaNames: POI[]
    }
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

export const rootActor = createActor(rootLogic)

rootActor.on('RENDER', ({ pointNames, areaNames }) => {
  return renderShadowRoot(ROOT_ID, MapHtmlRoot(pointNames, areaNames))
})

rootActor.start()

export function useMapHtmlContentRoot() {
  const { pointNames, areaNames } = useNames()

  useEffect(() => {
    mountMapHtmlContentRoot(ROOT_ID)
  }, [])

  useEffect(() => {
    rootActor.send({ type: 'UPDATE', pointNames, areaNames })
  }, [pointNames, areaNames])
}

function mountMapHtmlContentRoot(id: string) {
  const root = document.querySelector(`#${id}`)
  if (root === null || root.shadowRoot !== null) {
    return
  }
  // shadowRoot is present

  rootActor.send({ type: 'MOUNT' })
}

//// shadow DOM render

export function renderShadowRoot(
  id: string,
  children: Readonly<ReactNode>
): boolean {
  const root = document.querySelector(`#${id}`)
  if (root === null) {
    return false
  }
  if (root.shadowRoot !== null) {
    // shadowRoot is present
    return true
  }
  const shadowRoot = root.attachShadow({ mode: 'open' })
  createRoot(shadowRoot).render(children)
  return true
}
