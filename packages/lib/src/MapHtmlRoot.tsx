import { useSelector } from '@xstate/react'
import { useMemo } from 'react'
import { fixupCssString } from './lib/css'
import { POI } from './lib/geo'
import { isLiked, useLikes } from './lib/like'
import { useNames } from './lib/names'
import { pointerActor } from './lib/pointer-react'
import { selectLayoutSvgScaleS } from './lib/pointer-xstate'

export function MapHtmlRoot(
  pointNames: Readonly<POI[]>,
  areaNames: Readonly<POI[]>
) {
  return (
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
}

function MapHtmlContentStars(
  props: Readonly<{ _pointNames: Readonly<POI[]>; _areaNames: Readonly<POI[]> }>
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

function MapHtmlContentNamesPoint(
  props: Readonly<{ _pointNames: Readonly<POI[]> }>
) {
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

function MapHtmlContentNamesArea(
  props: Readonly<{ _areaNames: Readonly<POI[]> }>
) {
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
