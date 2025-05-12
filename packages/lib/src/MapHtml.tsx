import { useSelector } from '@xstate/react'
import { ReactNode, useMemo } from 'react'
import { LayersStyle } from './Layers'
import { svgMapViewerConfig as cfg } from './lib/config'
import { POI } from './lib/geo'
import { useLikes } from './lib/like'
import { PointerRef, selectLayoutSvgScale } from './lib/pointer-xstate'
import { cssMapHtmlTransform } from './lib/style'
import { Scale } from './lib/transform'

export interface MapHtmlProps {
  _pointerRef: PointerRef
}

export interface MapHtmlContentProps {
  _svgScale: Scale
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
      <style>{cfg.mapHtmlStyle}</style>
    </>
  )
}

function MapHtmlContent(props: Readonly<MapHtmlProps>) {
  const { _pointerRef: ref } = props

  const svgScale = useSelector(ref, selectLayoutSvgScale)

  return (
    <>
      <MapHtmlContentSymbols _svgScale={svgScale} />
      <MapHtmlContentStars _svgScale={svgScale} />
      <MapHtmlContentNames _svgScale={svgScale} />
      <LayersStyle />
    </>
  )
}

function MapHtmlContentSymbols(props: Readonly<MapHtmlContentProps>) {
  const { _svgScale: svgScale } = props

  return (
    <div className="poi-symbols">
      {cfg.mapSymbols
        .map(({ id, name, pos, size }) => ({
          id,
          name,
          pos,
          size,
        }))
        .map(({ id, name, pos: { x, y }, size }, i) => (
          <div
            key={i}
            className={`poi-symbols-item`}
            style={{
              transform: `${cssMapHtmlTransform()} translate(${x}px, ${y}px) scale(${svgScale.s}) translate(-50%, -50%)`,
            }}
          >
            <RenderSymbol poi={{ id, name, pos: { x, y }, size }} />
          </div>
        ))}
    </div>
  )
}

function MapHtmlContentStars(props: Readonly<MapHtmlContentProps>) {
  const { _svgScale: svgScale } = props
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
        .map(({ id, pos: { x, y } }, i) => (
          <div
            key={i}
            className={`poi-stars-item`}
            style={{
              transform: `${cssMapHtmlTransform()} translate(${x}px, ${y}px) scale(${svgScale.s}) translate(-50%, -50%)`,
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
  const { _svgScale: svgScale } = props

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
    () => 110 * 110 * svgScale.s * svgScale.s,
    [svgScale.s]
  )
  const xxsmall = useMemo(() => 90 * 90 * svgScale.s * svgScale.s, [svgScale.s])
  const xxxsmall = useMemo(
    () => 70 * 70 * svgScale.s * svgScale.s,
    [svgScale.s]
  )
  const tiny = useMemo(() => 50 * 50 * svgScale.s * svgScale.s, [svgScale.s])
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
        )
        .map(({ id, name, pos: { x, y }, size }, i) => (
          <div
            key={i}
            className={`poi-names-item`}
            style={{
              transform: `${cssMapHtmlTransform()} translate(${x}px, ${y}px) scale(${svgScale.s}) translate(-50%, -50%)`,
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
