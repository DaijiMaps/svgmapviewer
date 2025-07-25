/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'
import { svgMapViewerConfig } from '../../config'
import { useLayout } from '../../style-xstate'
import { useShadowRoot } from '../dom'
import { trunc2 } from '../utils'
import { fromSvgToContent } from '../viewer/coord'
import { MAP_HTML_CONTENT_ID, MAP_HTML_ROOT_ID } from './map-svg-react'
import { useNames } from './names'

export function MapHtml(): ReactNode {
  useShadowRoot(MAP_HTML_ROOT_ID, <MapHtmlContent />)

  return <div id={MAP_HTML_ROOT_ID} className="content svg" />
}

function MapHtmlContent(): ReactNode {
  return (
    <>
      <div id={MAP_HTML_CONTENT_ID}>
        <MapHtmlPointNames />
      </div>
      <MapHtmlStyle />
    </>
  )
}

function MapHtmlStyle(): ReactNode {
  const layout = useLayout()
  const { scroll } = layout
  const m = fromSvgToContent(layout)

  const style = `
#map-html-content {
  position: absolute;
  left: 0;
  top: 0;
  width: ${trunc2(scroll.width)}px;
  height: ${trunc2(scroll.height)}px;
  transform: ${m.toString()};
  transform-origin: left top;
}
`

  return <style>{style}</style>
}

function MapHtmlPointNames(): ReactNode {
  const { pointNames } = useNames()
  const m = svgMapViewerConfig.mapCoord.matrix

  return (
    <>
      {pointNames
        .map((p) => ({ ...p, pos: m.transformPoint(p.pos) }))
        .map((poi, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              transform: `translate(${poi.pos.x}px, ${poi.pos.y}px) scale(0.025) translate(-50%, -50%)`,
              transformOrigin: 'left top',
            }}
          >
            {poi.name.map((s, idx2) => (
              <p
                key={idx2}
                style={{ margin: 0, textAlign: 'center', width: '20em' }}
              >
                {s}
              </p>
            ))}
          </div>
        ))}
    </>
  )
}
