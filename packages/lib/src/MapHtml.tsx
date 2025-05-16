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
  { fontSize: '0', length: 20 },
  { fontSize: '45%', length: 50 },
  { fontSize: '55%', length: 100 },
  { fontSize: '65%', length: 130 },
  { fontSize: '80%', length: 170 },
  { fontSize: '100%', length: 200 },
  { fontSize: '140%', length: 250 },
  { fontSize: '190%', length: 300 },
  { fontSize: '260%', length: 450 },
  { fontSize: '350%', length: 600 },
  { fontSize: '500%', length: 800 },
]

function MapHtmlContentNames(props: Readonly<MapHtmlContentProps>) {
  const { _svgScaleS: s } = props

  const sizes = useMemo(
    () =>
      sizeParams.map(({ fontSize, length }) => ({
        fontSize,
        area: length * length * s * s,
      })),
    [s]
  )

  const names = useMemo(() => {
    const minArea = sizes[0].area
    const maxArea = sizes[sizes.length - 1].area
    return cfg.mapNames
      .filter(({ id }) => id !== undefined)
      .flatMap(({ id, name, pos, area }) =>
        area === undefined
          ? [
              {
                id,
                name,
                pos,
                area: 0,
                size: 1,
              },
            ]
          : area < minArea || area > maxArea // huge
            ? []
            : [
                {
                  id,
                  name,
                  pos,
                  area,
                  size: matchSize(area, sizes),
                },
              ]
      )
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
            fontSize: sizes[size].fontSize,
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
  // eslint-disable-next-line functional/no-loop-statements
  for (let i = 0; i < sizes.length; i = i + 1) {
    if (area < sizes[i].area) {
      return i
    }
  }
  return 0
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
