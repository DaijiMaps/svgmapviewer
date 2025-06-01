import { type ReactNode, useContext } from 'react'
import './MapSvg.css'
import { SvgMapViewerConfigContext } from './Root'

export function MapSvg(): ReactNode {
  const config = useContext(SvgMapViewerConfigContext)

  // viewBox will be updated by syncViewBox()
  return (
    <div id="map-svg" className="content svg">
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <use href={`#${config.map}`} />
      </svg>
    </div>
  )
}
