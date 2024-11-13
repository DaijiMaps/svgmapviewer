import { useSelector } from '@xstate/react'
import { ReactNode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createActor, emit, setup } from 'xstate'
import { svgMapViewerConfig as cfg } from './lib/config'
import { POI } from './lib/geo'
import { fromSvg, toOuter } from './lib/layout'
import { PointerRef, selectLayout } from './lib/pointer-xstate'

export interface MapHtmlProps {
  _pointerRef: PointerRef
}

export function MapHtml(props: Readonly<MapHtmlProps>) {
  // eslint-disable-next-line functional/no-expression-statements, functional/no-return-void
  useEffect(() => {
    // eslint-disable-next-line functional/no-expression-statements
    mountMapHtmlContentRoot(props._pointerRef)
  })

  return (
    <div className="content">
      <div id="map-html-content-root" />
    </div>
  )
}

function MapHtmlContentRoot(props: Readonly<{ ref: PointerRef }>): ReactNode {
  const { ref } = props

  return (
    <>
      <MapHtmlContentSymbols _pointerRef={ref} />
      <MapHtmlContentNames _pointerRef={ref} />
      <style>{cfg.mapHtmlStyle}</style>
    </>
  )
}

function MapHtmlContentSymbols(props: Readonly<MapHtmlProps>) {
  const layout = useSelector(props._pointerRef, selectLayout)

  return (
    <div className="poi-symbols">
      {cfg.mapSymbols
        .map(({ name, pos, size }) => ({
          name,
          pos: toOuter(fromSvg(pos, layout), layout),
          size,
        }))
        .map(({ name, pos: { x, y }, size }, i) => (
          <div
            key={i}
            className={`poi-symbols-item`}
            style={{
              transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
            }}
          >
            <RenderSymbol poi={{ name, pos: { x, y }, size }} />
          </div>
        ))}
    </div>
  )
}

function MapHtmlContentNames(props: Readonly<MapHtmlProps>) {
  const layout = useSelector(props._pointerRef, selectLayout)
  const scale = layout.svgScale.s

  return (
    <div className="poi-names">
      {cfg.mapNames
        .flatMap(({ name, pos, size }) =>
          size / scale < 10 && scale > 0.2
            ? []
            : [
                {
                  name,
                  pos: toOuter(fromSvg(pos, layout), layout),
                  size,
                },
              ]
        )
        .map(({ name, pos: { x, y }, size }, i) => (
          <div
            key={i}
            className={`poi-names-item`}
            style={{
              transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
            }}
          >
            <RenderName poi={{ name, pos: { x, y }, size }} />
          </div>
        ))}
    </div>
  )
}

function RenderSymbol(props: Readonly<{ poi: POI }>) {
  return (
    <p>
      {props.poi.name.map((n, j) => (
        <span key={j} className={n} />
      ))}
    </p>
  )
}

function RenderName(props: Readonly<{ poi: POI }>) {
  return (
    <>
      {props.poi.name.map((n, j) => (
        <p
          key={j}
          style={{
            fontSize:
              props.poi.size === 1
                ? 'x-small'
                : props.poi.size < 10
                  ? 'small'
                  : 'initial',
          }}
        >
          {n}
        </p>
      ))}
    </>
  )
}

//// shadow DOM actor

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
    'MAP.HTML': { actions: emit(({ event }) => event) },
  },
})

const rootActor = createActor(rootLogic)

// eslint-disable-next-line functional/no-expression-statements
rootActor.on('MAP.HTML', ({ ref }) =>
  renderShadowRoot('map-html-content-root', MapHtmlContentRoot({ ref }))
)

// eslint-disable-next-line functional/no-expression-statements
rootActor.start()

// eslint-disable-next-line functional/no-return-void
function mountMapHtmlContentRoot(ref: Readonly<PointerRef>) {
  const root = document.querySelector(`#map-html-content-root`)
  if (root === null) {
    return
  }
  if (root.shadowRoot !== null) {
    return
  }
  // eslint-disable-next-line functional/no-expression-statements
  rootActor.send({ type: 'MAP.HTML', ref })
}

//// shadow DOM render

function renderShadowRoot(id: string, children: Readonly<ReactNode>): boolean {
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
