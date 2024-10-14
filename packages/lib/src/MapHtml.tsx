import './MapHtml.css'
import { svgMapViewerConfig } from './lib/config'
import { fromSvg, toOuter } from './lib/layout'
import { POI } from './lib/map'
import { PointerRef } from './lib/pointer-xstate'
import { UiRef } from './lib/ui-xstate'

export interface MapHtml {
  _uiRef: UiRef
  _pointerRef: PointerRef
}

export function MapHtml(/*props: Readonly<MapHtmlProps>*/) {
  return (
    <div className="content">
      <div className="poi">
        {svgMapViewerConfig.mapNames
          .map(({ name, pos }) => ({ name, pos: toOuter(fromSvg(pos)) }))
          .map(({ name, pos: { x, y } }, i) => (
            <div
              key={i}
              className={`poi-item`}
              style={{
                transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
              }}
            >
              <RenderPOI poi={{ name, pos: { x, y } }} />
            </div>
          ))}
      </div>
    </div>
  )
}

function RenderPOI(props: Readonly<{ poi: POI }>) {
  return (
    <>
      {props.poi.name.map((n, j) => (
        <p key={j}>{n}</p>
      ))}
    </>
  )
}
