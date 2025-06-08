/* eslint-disable functional/functional-parameters */
import { Fragment, type ReactNode, useEffect, useMemo } from 'react'
import { fixupCssString } from './lib/css'
import { renderShadowRoot } from './lib/dom'
import { type POI } from './lib/geo'
import { isLiked, useLikes } from './lib/like'
import { MAP_HTML_ROOT_ID, useMapHtmlRendered } from './lib/map-html-react'
import { useNames } from './lib/names'
import { useViewerLayoutSvgScaleS } from './lib/viewer-xstate'
import './MapHtml.css'

export function MapHtmlRoot(): ReactNode {
  // eslint-disable-next-line functional/no-expression-statements, functional/no-return-void
  useEffect(() => renderShadowRoot(MAP_HTML_ROOT_ID, <MapHtml />), [])

  return <div id={MAP_HTML_ROOT_ID} className="content html" />
}

export function MapHtml(): ReactNode {
  const { pointNames, areaNames } = useNames()

  // eslint-disable-next-line functional/no-expression-statements
  useMapHtmlRendered()

  return (
    <>
      <style>
        <MapHtmlContentStyle />
        <MapHtmlContentNamesStyle _areaNames={areaNames} />
      </style>
      <MapHtmlContentStars _pointNames={pointNames} _areaNames={areaNames} />
      <MapHtmlContentNamesPoint _pointNames={pointNames} />
      <MapHtmlContentNamesArea _areaNames={areaNames} />
    </>
  )
}

function MapHtmlContentStyle(): ReactNode {
  return (
    <>
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
  contain: content;
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
    </>
  )
}

function MapHtmlContentStars(
  props: Readonly<{ _pointNames: Readonly<POI[]>; _areaNames: Readonly<POI[]> }>
): ReactNode {
  const { _pointNames: pointNames, _areaNames: areaNames } = props
  const likes = useLikes()

  // XXX
  // XXX
  // XXX
  // XXX use Map
  // XXX save (id -> POI) when like'ed/unlike'ed
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
  // XXX
  // XXX
  // XXX

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
): ReactNode {
  const { _pointNames: pointNames } = props

  return (
    <div className="poi-names point">
      {pointNames.map(({ id, name, pos: { x, y }, size }) => (
        <div
          key={id}
          id={`osm-id-${id}`}
          className={`poi-names-item`}
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
): ReactNode {
  const { _areaNames: areaNames } = props

  return (
    <div className="poi-names area">
      {areaNames.map(({ id, name, pos: { x, y }, size }) => (
        <div
          key={id}
          id={`osm-id-${id}`}
          className={`poi-names-item`}
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

function MapHtmlContentNamesStyle(
  props: Readonly<{ _areaNames: Readonly<POI[]> }>
): ReactNode {
  const { _areaNames: areaNames } = props

  const s = useViewerLayoutSvgScaleS()

  return (
    <>
      {areaNames.map(({ id, size }) => {
        const ss = size / s
        const MAX = 1000
        const MIN = 0
        const opacity = Math.pow(
          ss > MAX ? 0 : ss < MIN ? 1 : (MAX - ss) / (MAX - MIN),
          2
        )
        return (
          <Fragment key={id}>{`
#osm-id-${id} {
opacity: ${opacity};
}
`}</Fragment>
        )
      })}
    </>
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
