import { svgMapViewerConfig } from '../config'
import { RenderMapProps } from '../types'
import { RenderMapAssets } from './assets'
import { MapLayer, RenderMapLayers } from './layers'
import { MapMarkers, RenderMapMarkers } from './markers'
import { MapObjects, RenderMapObjects } from './objects'
import { MapSymbols, RenderMapSymbols } from './symbols'

export interface RenderMapCommonProps extends RenderMapProps {
  getMapLayers: () => MapLayer[]
  getMapObjects: () => MapObjects[]
  getMapSymbols: () => MapSymbols[]
  getMapMarkers: () => MapMarkers[]
}

export function RenderMapCommon(props: Readonly<RenderMapCommonProps>) {
  return (
    <>
      <RenderMapAssets />
      <g id={svgMapViewerConfig.map} className="map">
        <RenderMapLayers mapLayers={props.getMapLayers()} />
        <RenderMapObjects mapObjects={props.getMapObjects()} />
        <RenderMapSymbols {...props} mapSymbols={props.getMapSymbols()} />
        <RenderMapMarkers {...props} mapMarkers={props.getMapMarkers()} />
      </g>
    </>
  )
}
