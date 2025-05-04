import { useSelector } from '@xstate/react'
import { ReactNode, useEffect, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { createActor, emit, setup } from 'xstate'
import { svgMapViewerConfig as cfg } from './lib/config'
import { fromSvgToOuter } from './lib/coord'
import { POI } from './lib/geo'
import { useLikes } from './lib/like'
import {
  PointerRef,
  selectLayoutSvg,
  selectLayoutSvgOffset,
  selectLayoutSvgScale,
} from './lib/pointer-xstate'
import { Scale, transformPoint } from './lib/transform'
import { M } from './lib/tuple'

export interface MapHtmlProps {
  _pointerRef: PointerRef
}

export interface MapHtmlContentProps {
  _svgScale: Scale
  _m: M
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

  return (
    <>
      <MapHtmlContentSymbols _svgScale={svgScale} _m={x} />
      <MapHtmlContentStars _svgScale={svgScale} _m={x} />
      <MapHtmlContentNames _svgScale={svgScale} _m={x} />
    </>
  )
}

function MapHtmlContentSymbols(props: Readonly<MapHtmlContentProps>) {
  const { _m: x } = props

  return (
    <div className="poi-symbols">
      {cfg.mapSymbols
        .map(({ id, name, pos, size }) => ({
          id,
          name,
          pos: transformPoint(x, pos),
          size,
        }))
        .map(({ id, name, pos: { x, y }, size }, i) => (
          <div
            key={i}
            className={`poi-symbols-item`}
            style={{
              transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
            }}
          >
            <RenderSymbol poi={{ id, name, pos: { x, y }, size }} />
          </div>
        ))}
    </div>
  )
}

function MapHtmlContentStars(props: Readonly<MapHtmlContentProps>) {
  const { _m: x } = props
  const likes = useLikes()

  return (
    <div className="poi-stars">
      {cfg.mapNames
        .filter(({ id }) => id !== null && id !== 0 && likes.isLiked(id))
        .map(({ id, name, pos, area }) => ({
          id,
          name,
          pos: transformPoint(x, pos),
          area,
        }))
        .map(({ id, pos: { x, y } }, i) => (
          <div
            key={i}
            className={`poi-stars-item`}
            style={{
              transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
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

function MapHtmlContentNames(props: Readonly<MapHtmlContentProps>) {
  const { _svgScale: svgScale, _m: x } = props

  // XXX make these configurable
  //  const huge = useMemo(
  //    () => 1000 * 1000 * svgScale.s * svgScale.s,
  //    [svgScale.s]
  //  )
  const xxxlarge = useMemo(
    () => 800 * 800 * svgScale.s * svgScale.s,
    [svgScale.s]
  )
  const xxlarge = useMemo(
    () => 600 * 600 * svgScale.s * svgScale.s,
    [svgScale.s]
  )
  const xlarge = useMemo(
    () => 450 * 450 * svgScale.s * svgScale.s,
    [svgScale.s]
  )
  const large = useMemo(() => 320 * 320 * svgScale.s * svgScale.s, [svgScale.s])
  const normal = useMemo(
    () => 200 * 200 * svgScale.s * svgScale.s,
    [svgScale.s]
  )
  const small = useMemo(() => 140 * 140 * svgScale.s * svgScale.s, [svgScale.s])
  const xsmall = useMemo(
    () => 100 * 100 * svgScale.s * svgScale.s,
    [svgScale.s]
  )
  const xxsmall = useMemo(() => 70 * 70 * svgScale.s * svgScale.s, [svgScale.s])
  const xxxsmall = useMemo(
    () => 50 * 50 * svgScale.s * svgScale.s,
    [svgScale.s]
  )
  const point = useMemo(() => 10 * 10 * svgScale.s * svgScale.s, [svgScale.s])

  return (
    <div className="poi-names">
      {cfg.mapNames
        .flatMap(({ id, name, pos, area }) =>
          area === undefined
            ? [
                {
                  id,
                  name,
                  pos: transformPoint(x, pos),
                  size: 4,
                },
              ]
            : area < point || area > xxlarge // huge
              ? []
              : [
                  {
                    id,
                    name,
                    pos: transformPoint(x, pos),
                    size:
                      area < xxxsmall
                        ? -5
                        : area < xxsmall
                          ? -4
                          : area < xsmall
                            ? -3
                            : area < small
                              ? -2
                              : area < normal
                                ? -1
                                : area < large
                                  ? 0
                                  : area < xlarge
                                    ? 1
                                    : area < xxlarge
                                      ? 2
                                      : area < xxxlarge
                                        ? 3
                                        : 4,
                  },
                ]
        )
        .map(({ id, name, pos: { x, y }, size }, i) => (
          <div
            key={i}
            className={`poi-names-item`}
            style={{
              transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
            }}
          >
            <RenderName
              poi={{
                id,
                name: size === -5 ? [''] : name,
                pos: { x, y },
                size,
              }}
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

function RenderStar() {
  return (
    <p
      style={{
        color: 'orange',
        fontSize: 'larger',
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
        <p
          key={j}
          style={{
            fontSize:
              props.poi.size === -4
                ? '45%'
                : props.poi.size === -3
                  ? 'xx-small'
                  : props.poi.size === -2
                    ? 'x-small'
                    : props.poi.size === -1
                      ? 'small'
                      : props.poi.size === 0
                        ? 'initial'
                        : props.poi.size === 1
                          ? 'large'
                          : props.poi.size === 2
                            ? 'x-large'
                            : props.poi.size === 3
                              ? 'xx-large'
                              : props.poi.size === 4
                                ? 'xxx-large'
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
