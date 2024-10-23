import { svgMapViewerConfig } from '../config'
import { RenderMapProps } from '../types'
import { RenderMapLayers } from './layers'
import { RenderMapMarkers } from './markers'
import { RenderMapObjects } from './objects'
import { RenderMapSymbols } from './symbols'

export function RenderMapCommon(props: Readonly<RenderMapProps>) {
  return (
    <>
      <svgMapViewerConfig.renderAssets />
      <g id={svgMapViewerConfig.map} className="map">
        <RenderMapLayers mapLayers={svgMapViewerConfig.getMapLayers()} />
        <RenderMapObjects mapObjects={svgMapViewerConfig.getMapObjects()} />
        <RenderMapSymbols
          {...props}
          mapSymbols={svgMapViewerConfig.getMapSymbols()}
        />
        <RenderMapMarkers
          {...props}
          mapMarkers={svgMapViewerConfig.getMapMarkers()}
        />
      </g>
    </>
  )
}
