/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'
import { fromSvgToScroll } from './lib/coord'
import { useShadowRoot } from './lib/dom'
import { MAP_HTML_CONTENT_ID, MAP_HTML_ROOT_ID } from './lib/map-svg-react'
import { useNames } from './lib/names'
import { useLayout } from './lib/style-xstate'
import { trunc2 } from './lib/utils'

export function MapHtml(): ReactNode {
  useShadowRoot(MAP_HTML_ROOT_ID, <MapHtmlContent />)

  return <div id={MAP_HTML_ROOT_ID} className="content svg" />
}

function MapHtmlContent(): ReactNode {
  const { scroll, svg, svgOffset, svgScale } = useLayout()
  const m = fromSvgToScroll({ svg, svgOffset, svgScale })

  return (
    <div
      id={MAP_HTML_CONTENT_ID}
      style={{
        width: trunc2(scroll.width),
        height: trunc2(scroll.height),
        transform: `
        ${m.toString()}
        `,
        transformOrigin: `left top`,
      }}
    >
      <MapHtmlPointNames />
      <style>{style}</style>
    </div>
  )
}

const style = `
#map-html-content {
  position: absolute;
  left: 0;
  top: 0;
}
`

function MapHtmlPointNames(): ReactNode {
  const { pointNames } = useNames()

  return (
    <>
      {pointNames.map((poi, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transform: `translate(${poi.pos.x}px, ${poi.pos.y}px) scale(0.02) translate(-50%, -50%)`,
            transformOrigin: 'left top',
          }}
        >
          {poi.name.map((s, idx2) => (
            <p key={idx2} style={{ margin: 0, textAlign: 'center' }}>
              {s}
            </p>
          ))}
        </div>
      ))}
    </>
  )
}
