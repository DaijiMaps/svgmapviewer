import { type ReactNode, useContext } from 'react'
import { boxToViewBox } from './lib/box/prefixed'
import { usePointerOrigLayoutSvg } from './lib/viewer-xstate'
import './MapSvg.css'
import { SvgMapViewerConfigContext } from './Root'

export function MapSvg(): ReactNode {
  // XXX only when resized
  const origLayoutSvg = usePointerOrigLayoutSvg()

  const config = useContext(SvgMapViewerConfigContext)

  // XXX truncate viewBox (1234.5678901234567890 to 1234.56)
  // XXX (too much precision degrades SVG rendering performance)
  return (
    <div className="content svg">
      <svg
        viewBox={boxToViewBox(origLayoutSvg).replaceAll(/([.]\d\d)\d*/g, '$1')}
        width="100%"
        height="100%"
      >
        <use href={`#${config.map}`} />
      </svg>
    </div>
  )
}
