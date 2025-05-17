import { useSelector } from '@xstate/react'
import { ReactNode, useMemo } from 'react'
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
  _svgScaleS: number
}

export function MapHtml(props: Readonly<MapHtmlProps>) {
  return (
    <div className="content html">
      <MapHtmlContentRoot {...props} />
    </div>
  )
}

function MapHtmlContentRoot(props: Readonly<MapHtmlProps>): ReactNode {
  return (
    <>
      <MapHtmlContent {...props} />
    </>
  )
}

function MapHtmlContent(props: Readonly<MapHtmlProps>) {
  const { _pointerRef: ref } = props

  const svgScaleS = useSelector(ref, selectLayoutSvgScaleS)

  return (
    <>
      <MapHtmlContentSymbols />
      <MapHtmlContentStars />
      <MapHtmlContentNames _svgScaleS={svgScaleS} />
      <LayersStyle />
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

function MapHtmlContentNames(props: Readonly<MapHtmlContentProps>) {
  const { _svgScaleS: s } = props

  const names = useMemo(() => {
    return cfg.mapNames
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
  }, [])

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
    const MIN = 100
    const opacity = ss > MAX ? 0 : ss < MIN ? 1 : (MAX - ss) / (MAX - MIN)
    return `
.poi-names-item.osm-id-${id} {
transform: ${fixupCssString(`var(--svg-matrix) translate(${x}px, ${y}px) scale(var(--svg-scale)) translate(-50%, -50%) scale(calc(${size} / 100 / var(--svg-scale)))`)};
opacity: ${opacity};
}`
  })
  .join('')}`}
      </style>
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
