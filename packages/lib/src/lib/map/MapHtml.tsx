/* eslint-disable functional/no-expression-statements */

import { useRef, type ReactNode } from 'react'

import { type OsmRenderMapProps } from '../../types'
import { useShadowRoot } from '../dom'
import { useLayoutStyleRef } from '../viewer/layout/style'
import { MAP_HTML_CONTENT_ID, MAP_HTML_ROOT_ID } from './map-svg-react'
import { useNames } from './names'

export function MapHtml(props: Readonly<OsmRenderMapProps>): ReactNode {
  useShadowRoot(MAP_HTML_ROOT_ID, <MapHtmlRoot {...props} />)

  return <div id={MAP_HTML_ROOT_ID} className="content svg" />
}

function MapHtmlRoot(props: Readonly<OsmRenderMapProps>): ReactNode {
  const ref = useRef(null)
  useLayoutStyleRef(ref, 'map-html')
  return (
    <>
      <div ref={ref} id={MAP_HTML_CONTENT_ID} className="content-html">
        <MapHtmlPointNames {...props} stroke={true} />
        <MapHtmlPointNames {...props} />
      </div>
      <style>{style}</style>
    </>
  )
}

const style = `
#map-html-content {
  position: absolute;
  left: 0;
  top: 0;
  width: var(--layout-scroll-width);
  height: var(--layout-scroll-height);
  transform: var(--layout-svg-to-content-matrix);
  transform-origin: left top;
}

.stroke {
  text-stroke: 3px white;
  -webkit-text-stroke: 3px white;
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
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              transform: `translate(${poi.coord.x}px, ${poi.coord.y}px) scale(0.025) translate(-50%, -50%)`,
              transformOrigin: 'left top',
            }}
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
