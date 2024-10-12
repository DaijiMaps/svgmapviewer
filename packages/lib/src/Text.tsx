import './Text.css'
import { svgMapViewerConfig } from './lib/config'
import { fromSvg, toOuter } from './lib/layout'
import { PointerRef } from './lib/pointer-xstate'
import { UiRef } from './lib/ui-xstate'

export interface TextProps {
  _uiRef: UiRef
  _pointerRef: PointerRef
}

export function Text(/*props: Readonly<TextProps>*/) {
  return (
    <div className="content">
      <div className="poi">
        {svgMapViewerConfig.mapPois.map((poi, idx) => {
          const { x, y } = toOuter(fromSvg(poi.pos))
          return (
            <div key={idx} className={`poi-item poi-item-${idx}`}>
              <style>{`
.poi-item-${idx} {
  transform: translate(${x}px, ${y}px) translate(-50%, -50%);
}
`}</style>
              {poi.name.map((n, idx2) => {
                return <p key={idx2}>{n}</p>
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
