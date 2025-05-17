import { configContext, selectMapNames } from '@daijimaps/svgmapviewer'
import { useSelector } from '@xstate/react'
import { ReactNode, useContext, useEffect, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { assign, createActor, emit, setup } from 'xstate'
import { LayersStyle } from './Layers'
import { svgMapViewerConfig as cfg } from './lib/config'
import { fixupCssString } from './lib/css'
import { POI } from './lib/geo'
import { useLikes } from './lib/like'
import { PointerRef, selectLayoutSvgScaleS } from './lib/pointer-xstate'
import './MapHtml.css'

export interface MapHtmlProps {
  _pointerRef: PointerRef
}

export interface MapHtmlContentProps {
  _names: (POI & { size: number })[]
}

export function MapHtml() {
  return (
    <div className="content html">
      <MapHtmlContentRoot />
    </div>
  )
}

export function MapHtmlStyle(props: Readonly<MapHtmlProps>) {
  return <MapHtmlContentStyle {...props} />
}

function MapHtmlContentRoot(): ReactNode {
  return (
    <>
      <MapHtmlContent />
    </>
  )
}

function useNames() {
  const configRef = useContext(configContext)
  const mapNames = useSelector(configRef, selectMapNames)

  const names = useMemo(() => {
    return mapNames
      .filter(({ id }) => id !== undefined)
      .flatMap(({ id, name, pos, area }) => {
        if (area === undefined) {
          return [{ id, name, pos, area: 1, size: 1 }]
        }
        return [
          {
            id,
            name,
            pos,
            area,
            size: Math.sqrt(area),
          },
        ]
      })
  }, [mapNames])

  return names
}

function MapHtmlContent() {
  //const names = useNames()

  return (
    <>
      <MapHtmlContentSymbols />
      <MapHtmlContentStars />
      {/*
      <MapHtmlContentNames _names={names} />
      */}
      <div className="poi-names" id={ROOT_ID} />
      <LayersStyle />
    </>
  )
}

function MapHtmlContentStyle(props: Readonly<MapHtmlProps>) {
  const names = useNames()

  // eslint-disable-next-line functional/no-expression-statements, functional/no-return-void
  useEffect(() => {
    // eslint-disable-next-line functional/no-expression-statements
    mountMapHtmlContentRoot(props._pointerRef)
  })

  // eslint-disable-next-line functional/no-expression-statements, functional/no-return-void
  useEffect(() => {
    // eslint-disable-next-line functional/no-expression-statements
    rootActor.send({ type: 'NAMES', names })
  }, [names])

  return (
    <>
      <MapHtmlContentNamesStyle {...props} />
    </>
  )
}

function MapHtmlContentSymbols() {
  return (
    <div className="poi-symbols">
      {cfg.mapSymbols
        .map(({ id, name, pos, size }) => ({
          id,
          name,
          pos,
          size,
        }))
        .map(({ id, name, pos: { x, y }, size }) => (
          <div
            key={id}
            className={`poi-symbols-item`}
            style={{
              transform: fixupCssString(
                `var(--svg-matrix) translate(${x}px, ${y}px) scale(var(--svg-scale)) translate(-50%, -50%)`
              ),
            }}
          >
            <RenderSymbol poi={{ id, name, pos: { x, y }, size }} />
          </div>
        ))}
    </div>
  )
}

function MapHtmlContentStars() {
  const likes = useLikes()

  return (
    <div className="poi-stars">
      {cfg.mapNames
        .filter(({ id }) => id !== null && id !== 0 && likes.isLiked(id))
        .map(({ id, name, pos, area }) => ({
          id,
          name,
          pos,
          area,
        }))
        .map(({ id, pos: { x, y } }) => (
          <div
            key={id}
            className={`poi-stars-item`}
            style={{
              transform: fixupCssString(
                `var(--svg-matrix) translate(${x}px, ${y}px) scale(var(--svg-scale)) translate(-50%, -50%)`
              ),
            }}
          >
            {id !== null && likes.isLiked(id) && (
              <div>
                <RenderStar />
              </div>
            )}
          </div>
        ))}
    </div>
  )
}

function MapHtmlContentNames(props: Readonly<{ _names: POI[] }>) {
  const { _names: names } = props

  return (
    <div className="poi-names">
      {names.map(({ id, name, pos: { x, y }, size }) => (
        <div key={id} className={`poi-names-item osm-id-${id}`}>
          <RenderName
            poi={{
              id,
              name: size === 0 ? [''] : name,
              pos: { x, y },
              size,
            }}
          />
        </div>
      ))}
    </div>
  )
}

function MapHtmlContentNamesStyle(
  props: Readonly<{ _pointerRef: PointerRef }>
) {
  const { _pointerRef: pointerRef } = props
  const names = useNames()

  const s = useSelector(pointerRef, selectLayoutSvgScaleS)

  return (
    <div className="poi-names">
      <style>
        {`
.poi-names-item {
--s: ${s};
--nnames: ${names.length};
}
${names
  .map(({ id, pos: { x, y }, size }) => {
    const ss = size / s
    const MAX = 500
    const MIN = 0
    const opacity = ss > MAX ? 0 : ss < MIN ? 1 : (MAX - ss) / (MAX - MIN)
    return `
.poi-names-item.osm-id-${id} {
transform: ${fixupCssString(`var(--svg-matrix) translate(${x}px, ${y}px) scale(var(--svg-scale)) translate(-50%, -50%) scale(calc(${size} / 100 / var(--svg-scale)))`)};
opacity: ${opacity};
}`
  })
  .join('')}`}
      </style>
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

function RenderStar() {
  return (
    <p
      style={{
        color: 'orange',
      }}
    >
      ★
    </p>
  )
}

function RenderName(props: Readonly<{ poi: POI }>) {
  return (
    <>
      {props.poi.name.map((n, j) => (
        <p key={j}>{n}</p>
      ))}
    </>
  )
}

//// shadow DOM actor

const ROOT_ID = 'map-html-content-root'

type RootEvent =
  | {
      type: 'MOUNT'
      ref: PointerRef
    }
  | {
      type: 'NAMES'
      names: POI[]
    }
  | {
      type: 'RENDER'
    }
type RootEmit = {
  type: 'RENDER'
  ref: null | PointerRef
  names: POI[]
}
interface RootContext {
  ref: null | PointerRef
  names: POI[]
}

const rootLogic = setup({
  types: {
    events: {} as RootEvent,
    emitted: {} as RootEmit,
    context: {} as RootContext,
  },
}).createMachine({
  id: 'map-html-names-root',
  context: { ref: null, names: [] },
  on: {
    MOUNT: {
      actions: assign({
        ref: ({ event }) => event.ref,
      }),
    },
    NAMES: [
      {
        guard: ({ context }) => context.ref === null,
      },
      {
        guard: ({ context }) => context.ref !== null,
        actions: [
          assign({
            names: ({ event }) => event.names,
          }),
          emit(({ context, event }) => ({
            type: 'RENDER',
            ref: context.ref,
            names: event.names,
          })),
        ],
      },
    ],
    RENDER: {
      actions: emit(({ context }) => ({
        type: 'RENDER',
        ref: context.ref,
        names: context.names,
      })),
    },
  },
})

const rootActor = createActor(rootLogic)

// eslint-disable-next-line functional/no-expression-statements
rootActor.on('RENDER', ({ ref, names }) => {
  if (ref === null) {
    return
  }
  return renderShadowRoot(
    ROOT_ID,
    <>
      <style>
        {`
.poi-names-item {
  position: absolute;
  padding: 0.5em;
  background-color: rgba(255, 255, 255, 0.375);
  text-align: center;
  border-radius: 5em;
}
.poi-names-item > p {
  margin: 0;
}
`}
      </style>
      <MapHtmlContentNames _names={names} />
      <MapHtmlContentStyle _pointerRef={ref} />
    </>
  )
})

// eslint-disable-next-line functional/no-expression-statements
rootActor.start()

// eslint-disable-next-line functional/no-return-void
export function mountMapHtmlContentRoot(ref: Readonly<PointerRef>) {
  const root = document.querySelector(`#${ROOT_ID}`)
  if (root === null) {
    return
  }
  if (root.shadowRoot !== null) {
    return
  }
  // eslint-disable-next-line functional/no-expression-statements
  rootActor.send({ type: 'MOUNT', ref })
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
