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

// XXX make these configurable
const sizeParams = [
  { fontSize: '70%', length: 10 },
  { fontSize: '45%', length: 40 },
  { fontSize: '55%', length: 70 },
  { fontSize: '65%', length: 90 },
  { fontSize: '75%', length: 120 },
  { fontSize: '85%', length: 160 },
  { fontSize: '100%', length: 230 },
  { fontSize: '120%', length: 300 },
  { fontSize: '140%', length: 450 },
  { fontSize: '160%', length: 600 },
  { fontSize: '180%', length: 800 },
  { fontSize: '210%', length: 1200 },
  { fontSize: '240%', length: 1600 },
  { fontSize: '300%', length: 2000 }, // XXX max - not actually used
]

function MapHtmlContentNames(props: Readonly<MapHtmlContentProps>) {
  const { _svgScaleS: s } = props

  const sizes = useMemo(
    () =>
      sizeParams.map(({ fontSize, length }) => ({
        fontSize,
        area: length * length * (s * s * Math.sqrt(s)),
      })),
    [s]
  )

  const names = useMemo(() => {
    return cfg.mapNames
      .filter(({ id }) => id !== undefined)
      .flatMap(({ id, name, pos, area }) => {
        if (area === undefined) {
          return [{ id, name, pos, area: 0, size: 1 }]
        }
        const size = matchSize(area, sizes)
        if (size < 0) {
          return []
        }
        return [{ id, name, pos, area, size }]
      })
  }, [sizes])

  return (
    <div className="poi-names">
      {names.map(({ id, name, pos: { x, y }, area, size }) => (
        <div
          key={id}
          className={`poi-names-item`}
          style={{
            transform: fixupCssString(
              `var(--svg-matrix) translate(${x}px, ${y}px) scale(var(--svg-scale)) translate(-50%, -50%)`
            ),
            fontSize: sizeParams[size].fontSize,
          }}
        >
          <RenderName
            poi={{
              id,
              name: size === 0 ? [''] : name,
              pos: { x, y },
              size,
            }}
            area={area}
          />
        </div>
      ))}
    </div>
  )
}

function matchSize(
  area: number,
  sizes: Readonly<{ fontSize: string; area: number }[]>
): number {
  if (area < sizes[0].area) {
    return -1
  }
  // eslint-disable-next-line functional/no-loop-statements
  for (let i = 0; i < sizes.length - 1; i = i + 1) {
    if (area > sizes[i].area && area < sizes[i + 1].area) {
      return i
    }
  }
  return -1
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

function RenderName(props: Readonly<{ poi: POI; area: number }>) {
  return (
    <>
      {props.poi.name.map((n, j) => (
        <p key={j}>{n}</p>
      ))}
    </>
  )
}
