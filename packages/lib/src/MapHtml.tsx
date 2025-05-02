import { useSelector } from '@xstate/react'
import clsx from 'clsx'
import { ReactNode, useEffect, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { createActor, emit, setup } from 'xstate'
import { svgMapViewerConfig as cfg } from './lib/config'
import { fromSvgToOuter } from './lib/coord'
import { POI } from './lib/geo'
import {
  PointerRef,
  selectLayoutSvg,
  selectLayoutSvgOffset,
  selectLayoutSvgScale,
  selectNextLayoutSvgScale,
  selectNextZoom,
  selectZoom,
} from './lib/pointer-xstate'
import { Scale, transformPoint } from './lib/transform'
import { M } from './lib/tuple'

export interface MapHtmlProps {
  _pointerRef: PointerRef
}

export interface MapHtmlContentProps {
  _svgScale: Scale
  _m: M
  _z: number
  _change: number // -1 -> disappearing | 0 -> none | 1 -> appearing
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
      <MapHtmlContent _pointerRef={ref} />
      <style>{cfg.mapHtmlStyle}</style>
    </>
  )
}

function MapHtmlContent(props: Readonly<MapHtmlProps>) {
  const { _pointerRef: ref } = props

  const svgOffset = useSelector(ref, selectLayoutSvgOffset)
  const svgScale = useSelector(ref, selectLayoutSvgScale)
  const svg = useSelector(ref, selectLayoutSvg)
  const x = useMemo(
    () => fromSvgToOuter({ svg, svgOffset, svgScale }),
    [svg, svgOffset, svgScale]
  )
  const nextSvgScale = useSelector(ref, selectNextLayoutSvgScale)
  const zoom = useSelector(ref, selectZoom)
  const nextZoom = useSelector(ref, selectNextZoom)

  // XXX loop with zoom as key
  return (
    <>
      {(zoom === nextZoom
        ? [{ s: svgScale, z: zoom, x, c: 0 }]
        : [
            { s: svgScale, z: zoom, x, c: -1 },
            { s: nextSvgScale, z: nextZoom, x: x, c: 1 },
          ]
      ).map(({ s, z, x, c }) => (
        <div key={z}>
          <MapHtmlContentSymbols _svgScale={s} _m={x} _z={z} _change={c} />
          <MapHtmlContentNames _svgScale={s} _m={x} _z={z} _change={c} />
        </div>
      ))}
    </>
  )
}

function MapHtmlContentSymbols(props: Readonly<MapHtmlContentProps>) {
  const { _m: x, _change: c } = props

  return (
    <div
      className={clsx(
        'poi-symbols',
        c === 1 && 'appearing',
        c === -1 && 'disappearing'
      )}
    >
      {cfg.mapSymbols
        .map(({ name, pos, size }) => ({
          name,
          pos: transformPoint(x, pos),
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

function MapHtmlContentNames(props: Readonly<MapHtmlContentProps>) {
  const { _svgScale: svgScale, _m: x, _change: c } = props

  // XXX make these configurable
  const huge = useMemo(
    () => 1000 * 1000 * svgScale.s * svgScale.s,
    [svgScale.s]
  )
  const normal = useMemo(
    () => 160 * 160 * svgScale.s * svgScale.s,
    [svgScale.s]
  )
  const small = useMemo(() => 120 * 120 * svgScale.s * svgScale.s, [svgScale.s])
  const xsmall = useMemo(() => 80 * 80 * svgScale.s * svgScale.s, [svgScale.s])
  const xxsmall = useMemo(() => 50 * 50 * svgScale.s * svgScale.s, [svgScale.s])
  const xxxsmall = useMemo(
    () => 30 * 30 * svgScale.s * svgScale.s,
    [svgScale.s]
  )
  const point = useMemo(() => 10 * 10 * svgScale.s * svgScale.s, [svgScale.s])

  return (
    <div
      className={clsx(
        'poi-names',
        c === 1 && 'appearing',
        c === -1 && 'disappearing'
      )}
    >
      {cfg.mapNames
        .flatMap(({ name, pos, area }) =>
          area === undefined
            ? [
                {
                  name,
                  pos: transformPoint(x, pos),
                  size: 4,
                },
              ]
            : area < point || area > huge
              ? []
              : [
                  {
                    name,
                    pos: transformPoint(x, pos),
                    size:
                      area < xxxsmall
                        ? 6
                        : area < xxsmall
                          ? 5
                          : area < xsmall
                            ? 4
                            : area < small
                              ? 3
                              : area < normal
                                ? 2
                                : 1,
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
            <RenderName
              poi={{ name: size === 6 ? [''] : name, pos: { x, y }, size }}
            />
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
              props.poi.size === 5
                ? '45%'
                : props.poi.size === 4
                  ? 'xx-small'
                  : props.poi.size === 3
                    ? 'x-small'
                    : props.poi.size === 2
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
