import { useSelector } from '@xstate/react'
import { ReactNode, useEffect, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { assign, createActor, emit, setup } from 'xstate'
import { configActor, selectMapNames } from './lib'
import { fixupCssString } from './lib/css'
import { POI } from './lib/geo'
import { isLiked, useLikes } from './lib/like'
import { pointerActor } from './lib/pointer-react'
import { selectLayoutSvgScaleS } from './lib/pointer-xstate'
import './MapHtml.css'

export function MapHtml() {
  // eslint-disable-next-line functional/no-expression-statements
  useMapHtmlContentRoot()

  return (
    <div className="content html">
      <div id={ROOT_ID} />
    </div>
  )
}

function useNames() {
  const mapNames = useSelector(configActor, selectMapNames)

  const pointNames = useMemo(() => {
    return mapNames.filter(
      ({ id, area }) => id !== undefined && area === undefined
    )
  }, [mapNames])

  const areaNames = useMemo(() => {
    return mapNames.flatMap(({ id, name, pos, area }) => {
      return id === undefined || area === undefined
        ? []
        : [
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

  return { pointNames, areaNames }
}

/*
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
*/

function MapHtmlContentStars(
  props: Readonly<{ _pointNames: POI[]; _areaNames: POI[] }>
) {
  const { _pointNames: pointNames, _areaNames: areaNames } = props
  const likes = useLikes()

  const likedNames = useMemo(
    () =>
      [...pointNames, ...areaNames]
        .filter(({ id }) => id !== null && id !== 0 && likes.has(id))
        .map(({ id, name, pos, area }) => ({
          id,
          name,
          pos,
          area,
        })),
    [areaNames, likes, pointNames]
  )

  return (
    <div className="poi-stars">
      {likedNames.map(({ id, pos: { x, y } }) => (
        <div
          key={id}
          className={`poi-stars-item`}
          style={{
            transform: fixupCssString(
              `var(--svg-matrix) translate(${x}px, ${y}px) scale(var(--svg-scale)) translate(-50%, -50%)`
            ),
          }}
        >
          {id !== null && isLiked(id) && (
            <div>
              <RenderStar />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function MapHtmlContentNamesPoint(props: Readonly<{ _pointNames: POI[] }>) {
  const { _pointNames: pointNames } = props

  return (
    <div className="poi-names point">
      {pointNames.map(({ id, name, pos: { x, y }, size }) => (
        <div
          key={id}
          className={`poi-names-item osm-id-${id}`}
          style={{
            transform: fixupCssString(
              `var(--svg-matrix) translate(${x}px, ${y}px) scale(var(--svg-scale)) translate(-50%, -50%) scale(calc(0.1 / max(0.1, var(--svg-scale))))`
            ),
          }}
        >
          <RenderName
            poi={{
              id,
              name,
              pos: { x, y },
              size,
            }}
          />
        </div>
      ))}
    </div>
  )
}

function MapHtmlContentNamesArea(props: Readonly<{ _areaNames: POI[] }>) {
  const { _areaNames: areaNames } = props

  return (
    <div className="poi-names area">
      {areaNames.map(({ id, name, pos: { x, y }, size }) => (
        <div
          key={id}
          className={`poi-names-item osm-id-${id}`}
          style={{
            transform: fixupCssString(
              `var(--svg-matrix) translate(${x}px, ${y}px) scale(var(--svg-scale)) translate(-50%, -50%) scale(calc(${size} / 200 / var(--svg-scale)))`
            ),
          }}
        >
          <RenderName
            poi={{
              id,
              name,
              pos: { x, y },
              size,
            }}
          />
        </div>
      ))}
    </div>
  )
}

function MapHtmlContentNamesStyle() {
  const { areaNames } = useNames()

  const s = useSelector(pointerActor, selectLayoutSvgScaleS)

  return (
    <div className="poi-names">
      <style>
        {`
${areaNames
  .map(({ id, size }) => {
    const ss = size / s
    const MAX = 1000
    const MIN = 0
    const opacity = Math.pow(
      ss > MAX ? 0 : ss < MIN ? 1 : (MAX - ss) / (MAX - MIN),
      2
    )
    return `
.poi-names-item.osm-id-${id} {
opacity: ${opacity};
}
`
  })
  .join('')}`}
      </style>
    </div>
  )
}

/*
function RenderSymbol(props: Readonly<{ poi: POI }>) {
  return (
    <p>
      {props.poi.name.map((n, j) => (
        <span key={j} className={n} />
      ))}
    </p>
  )
}
*/

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

// eslint-disable-next-line functional/no-expression-statements
rootActor.on('RENDER', ({ pointNames, areaNames }) => {
  return renderShadowRoot(
    ROOT_ID,
    <>
      <style>
        {`
.poi-stars,
.poi-stars-item,
.poi-names,
.poi-names-item {
  position: absolute;
  left: 0;
  top: 0;
}
.poi-stars,
.poi-names {
  width: 100%;
  height: 100%;
}
.poi-names-item {
  padding: 0.5em;
  background-color: rgba(255, 255, 255, 0.375);
  text-align: center;
}
.point > .poi-names-item {
  padding: 0.75em;
}
.area > .poi-names-item {
  border-radius: 3em;
}
.poi-names-item > p {
  margin: 0;
}
`}
      </style>
      <MapHtmlContentStars _pointNames={pointNames} _areaNames={areaNames} />
      <MapHtmlContentNamesPoint _pointNames={pointNames} />
      <MapHtmlContentNamesArea _areaNames={areaNames} />
      <MapHtmlContentNamesStyle />
    </>
  )
})

// eslint-disable-next-line functional/no-expression-statements
rootActor.start()

// eslint-disable-next-line functional/no-return-void
function useMapHtmlContentRoot() {
  const { pointNames, areaNames } = useNames()

  // eslint-disable-next-line functional/no-expression-statements, functional/no-return-void
  useEffect(() => {
    // eslint-disable-next-line functional/no-expression-statements
    mountMapHtmlContentRoot(ROOT_ID)
  }, [])

  // eslint-disable-next-line functional/no-expression-statements, functional/no-return-void
  useEffect(() => {
    // eslint-disable-next-line functional/no-expression-statements
    rootActor.send({ type: 'UPDATE', pointNames, areaNames })
  }, [pointNames, areaNames])
}

// eslint-disable-next-line functional/no-return-void
function mountMapHtmlContentRoot(id: string) {
  const root = document.querySelector(`#${id}`)
  if (root === null || root.shadowRoot !== null) {
    return
  }
  // shadowRoot is present

  // eslint-disable-next-line functional/no-expression-statements
  rootActor.send({ type: 'MOUNT' })
}

//// shadow DOM render

function renderShadowRoot(id: string, children: Readonly<ReactNode>): boolean {
  const root = document.querySelector(`#${id}`)
  if (root === null) {
    return false
  }
  if (root.shadowRoot !== null) {
    // shadowRoot is present
    return true
  }
  const shadowRoot = root.attachShadow({ mode: 'open' })
  // eslint-disable-next-line functional/no-expression-statements
  createRoot(shadowRoot).render(children)
  return true
}
