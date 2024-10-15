import { useSelector } from '@xstate/react'
import { ReactNode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createActor, emit, setup } from 'xstate'
import './MapHtml.css'
import { svgMapViewerConfig } from './lib/config'
import { fromSvg, toOuter } from './lib/layout'
import { POI } from './lib/map'
import { PointerRef, selectLayout } from './lib/pointer-xstate'

export interface MapHtmlProps {
  _pointerRef: PointerRef
}

export function MapHtml(props: Readonly<MapHtmlProps>) {
  // eslint-disable-next-line functional/no-expression-statements, functional/no-return-void
  useEffect(() => {
    const root = document.querySelector(`#map-html-content-root`)
    if (root === null) {
      return
    }
    if (root.shadowRoot !== null) {
      return
    }
    // eslint-disable-next-line functional/no-expression-statements
    rootActor.send({ type: 'MAP.HTML', ref: props._pointerRef })
  })

  return (
    <div className="content">
      <div id="map-html-content-root" />
    </div>
  )
}

export function MapHtmlContent(props: Readonly<MapHtmlProps>) {
  const layout = useSelector(props._pointerRef, selectLayout)

  return (
    <div className="poi">
      {svgMapViewerConfig.mapNames
        .map(({ name, pos }) => ({
          name,
          pos: toOuter(fromSvg(pos, layout), layout),
        }))
        .map(({ name, pos: { x, y } }, i) => (
          <div
            key={i}
            className={`poi-item`}
            style={{
              transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
            }}
          >
            <RenderPOI poi={{ name, pos: { x, y } }} />
          </div>
        ))}
    </div>
  )
}

function RenderPOI(props: Readonly<{ poi: POI }>) {
  return (
    <>
      {props.poi.name.map((n, j) => (
        <p key={j}>{n}</p>
      ))}
    </>
  )
}

function mountShadow(id: string, children: Readonly<ReactNode>): boolean {
  const root = document.querySelector(`#${id}`)
  if (root === null) {
    return false
  }
  if (root.shadowRoot !== null) {
    return true
  }
  const shadowRoot = root.attachShadow({ mode: 'open' })
  // eslint-disable-next-line functional/no-expression-statements
  createRoot(shadowRoot).render(children)
  return true
}

function mapHtmlContentRoot(ref: Readonly<PointerRef>): ReactNode {
  return (
    <>
      <MapHtmlContent _pointerRef={ref} />
      <style>
        {`
.poi-item {
  position: absolute;
  padding: 0.5em;
  background-color: rgba(255, 255, 255, 0.5);
  text-align: center;
}
.poi-item > p {
  margin: 0;
}
`}
      </style>
    </>
  )
}

type RootEvent = {
  type: 'MAP.HTML'
  ref: PointerRef
}

const rootLogic = setup({
  types: {
    events: {} as RootEvent,
    emitted: {} as RootEvent,
  },
}).createMachine({
  on: {
    'MAP.HTML': {
      actions: emit(({ event }) => event),
    },
  },
})

const rootActor = createActor(rootLogic)

// eslint-disable-next-line functional/no-expression-statements
rootActor.on('MAP.HTML', ({ ref }) =>
  mountShadow('map-html-content-root', mapHtmlContentRoot(ref))
)

// eslint-disable-next-line functional/no-expression-statements
rootActor.start()
