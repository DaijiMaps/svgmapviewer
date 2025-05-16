import { LayersSvgStyle } from '../../Layers'
import { svgMapViewerConfig as cfg } from '../config'
import { RenderMapProps } from '../types'
import { RenderMapLayers } from './layers'
import { RenderMapMarkers } from './markers'
import { RenderMapObjects } from './objects'
import { RenderMapSymbols, RenderMapSymbolStyles } from './symbols'

export function RenderMapCommon(props: Readonly<RenderMapProps>) {
  return (
    <>
      <cfg.renderAssets />
      <g id={cfg.map} className="map">
        <RenderMapLayers mapLayers={cfg.getMapLayers()} />
        <RenderMapObjects mapObjects={cfg.getMapObjects()} />
        <RenderMapSymbols {...props} mapSymbols={cfg.getMapSymbols()} />
        <RenderMapSymbolStyles {...props} mapSymbols={cfg.getMapSymbols()} />
        <RenderMapMarkers {...props} mapMarkers={cfg.getMapMarkers()} />
        <LayersSvgStyle />
      </g>
    </>
  )
}
