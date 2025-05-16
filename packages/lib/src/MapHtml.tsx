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

  // XXX make these configurable
  //  const huge = useMemo(
  //    () => 1000 * 1000 * s * s,
  //    [s]
  //  )
  const xxxlarge = useMemo(() => 800 * 800 * s * s, [s])
  const xxlarge = useMemo(() => 600 * 600 * s * s, [s])
  const xlarge = useMemo(() => 450 * 450 * s * s, [s])
  const large = useMemo(() => 320 * 320 * s * s, [s])
  const normal = useMemo(() => 200 * 200 * s * s, [s])
  const small = useMemo(() => 140 * 140 * s * s, [s])
  const xsmall = useMemo(() => 110 * 110 * s * s, [s])
  const xxsmall = useMemo(() => 90 * 90 * s * s, [s])
  const xxxsmall = useMemo(() => 70 * 70 * s * s, [s])
  const tiny = useMemo(() => 50 * 50 * s * s, [s])
  const point = useMemo(() => 10 * 10 * s * s, [s])

  const names = useMemo(
    () =>
      cfg.mapNames
        .filter(({ id }) => id !== undefined)
        .flatMap(({ id, name, pos, area }) =>
          area === undefined
            ? [
                {
                  id,
                  name,
                  pos,
                  size: -5,
                },
              ]
            : area < point || area > xxlarge // huge
              ? []
              : [
                  {
                    id,
                    name,
                    pos,
                    size:
                      area < tiny
                        ? -6
                        : area < xxxsmall
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
        ),
    [
      large,
      normal,
      point,
      small,
      tiny,
      xlarge,
      xsmall,
      xxlarge,
      xxsmall,
      xxxlarge,
      xxxsmall,
    ]
  )

  return (
    <div className="poi-names">
      {names.map(({ id, name, pos: { x, y }, size }) => (
        <div
          key={id}
          className={`poi-names-item`}
          style={{
            transform: fixupCssString(
              `var(--svg-matrix) translate(${x}px, ${y}px) scale(var(--svg-scale)) translate(-50%, -50%)`
            ),
          }}
        >
          <RenderName
            poi={{
              id,
              name: size === -6 ? [''] : name,
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
        <p
          key={j}
          style={{
            fontSize:
              props.poi.size === -5
                ? '35%'
                : props.poi.size === -4
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
