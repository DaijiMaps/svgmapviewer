/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */

import { useRef, type CSSProperties, type ReactNode } from 'react'

import { type OsmRenderMapProps } from '../../types'
import { RenderMapAssetsDefault } from '../carto/assets'
import { RenderMapSymbols2 } from '../carto/symbols'
import { useShadowRoot } from '../dom'
import { trunc2 } from '../utils'
import {
  useLayoutStyleRef,
  useSvgScaleStyleRef,
  useZoomSStyleRef,
} from '../viewer/layout/style'
import { MAP_HTML_CONTENT_ID, MAP_HTML_ROOT_ID } from './map-svg-react'
import { useNames } from './names'

export function MapHtml(props: Readonly<OsmRenderMapProps>): ReactNode {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutStyleRef(ref, 'map-html-root')
  useShadowRoot(MAP_HTML_ROOT_ID, <MapHtmlRoot {...props} />)

  return <div ref={ref} id={MAP_HTML_ROOT_ID} className="content svg" />
}

function MapHtmlRoot(props: Readonly<OsmRenderMapProps>): ReactNode {
  const ref = useRef(null)
  useZoomSStyleRef(ref, 'map-html')
  useLayoutStyleRef(ref, 'map-html')
  useSvgScaleStyleRef(ref, 'map-html')
  return (
    <>
      <div ref={ref} id={MAP_HTML_CONTENT_ID} className="content-html labels">
        <MapHtmlPointNames {...props} />
      </div>
      <MapSvgSymbolsDefs />
      <RenderMapSymbols2
        {...props}
        m={props.data.mapCoord.matrix}
        mapSymbols={props.render.getMapSymbols()}
      />
      <style>{style}</style>
    </>
  )
}

const style = `
.content-html {
  position: absolute;
  left: 0;
  top: 0;
  width: var(--layout-scroll-width);
  height: var(--layout-scroll-height);
  transform: var(--layout-svg-to-content-matrix) translateZ(0);
  transform-origin: 0% 0%;
  &.zooming {
    & > .map-symbol,
    & > .label {
      will-change: transform;
      animation: xxx-label 500ms ease forwards;
    }
  }
}
.stroke {
  text-stroke: 3px white;
  -webkit-text-stroke: 3px white;
}
.label {
  --poi-scale: 0.05;
}
.map-symbol {
  --poi-scale: 0.02;
}
.map-symbol,
.label {
  color: black;
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 0;
  will-change: transform;
  transform-origin: 0% 0%;
  transform:
    translate(var(--poi-x), var(--poi-y))
    scale(
      calc(
        var(--layout-fontsize) *
        var(--layout-svgscale) *
        var(--poi-scale))
      )
    translate(-50%, -50%);
}
.label::before {
  content: "";
  position: absolute;
  top: 0;
  left: 10em;
  aspect-ratio: 1 / 1;
  min-width: 20%;
  min-height: 20%;
  z-index: -1;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  will-change: transform, width, height; 
  transform: translate(-50%, calc(-50% + 0.75em));
}
svg {
  display: block;
}
@keyframes xxx-label {
  from {
    transform:
      translate(var(--poi-x), var(--poi-y))
      scale(
        calc(
          var(--layout-fontsize) *
          var(--layout-svgscale) *
          var(--poi-scale))
        )
      translate(-50%, -50%);
  }
  to {
    transform:
      translate(var(--poi-x), var(--poi-y))
      scale(
        calc(
          1 / var(--zoom-s-symbols) *
          var(--layout-fontsize) *
          var(--layout-svgscale) *
          var(--poi-scale))
        )
      translate(-50%, -50%);
  }
}
`

function MapHtmlPointNames(
  props: Readonly<
    OsmRenderMapProps & {
      stroke?: boolean
    }
  >
): ReactNode {
  const { pointNames } = useNames()
  const m = props.data.mapCoord.matrix

  return (
    <>
      {pointNames
        .map((p) => ({ ...p, coord: m.transformPoint(p.coord) }))
        .map((poi, idx) => (
          <div
            key={idx}
            className="label"
            style={
              {
                '--poi-x': `${trunc2(poi.coord.x)}px`,
                '--poi-y': `${trunc2(poi.coord.y)}px`,
                display: idx % 2 === 0 ? null : 'none',
              } as CSSProperties
            }
          >
            {(typeof poi.name === 'string' ? [poi.name] : poi.name).map(
              (s, idx2) => (
                <p
                  key={idx2}
                  className={props.stroke ? 'stroke' : undefined}
                  style={{ margin: 0, textAlign: 'center', width: '20em' }}
                >
                  {s}
                </p>
              )
            )}
          </div>
        ))}
    </>
  )
}

function MapSvgSymbolsDefs(): ReactNode {
  return (
    <svg id="map-svg-symbols-defs">
      <g id="map-svg-symbols1">
        <defs>
          <RenderMapAssetsDefault />
        </defs>
      </g>
    </svg>
  )
}

/*
        <RenderMapSymbols
          {...props}
          m={props.data.mapCoord.matrix}
          mapSymbols={props.render.getMapSymbols()}
        />
*/
