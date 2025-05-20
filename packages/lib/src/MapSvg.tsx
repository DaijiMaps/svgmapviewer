import { useSelector } from '@xstate/react'
import { useContext } from 'react'
import { boxToViewBox } from './lib/box/prefixed'
import { pointerActor } from './lib/pointer-react'
import { selectOrigLayoutSvg } from './lib/pointer-xstate'
import './MapSvg.css'
import { SvgMapViewerConfigContext } from './Root'

export const MapSvg = () => {
  // XXX only when resized
  const origLayoutSvg = useSelector(pointerActor, selectOrigLayoutSvg)

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
