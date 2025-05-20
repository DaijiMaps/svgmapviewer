import { svgMapViewerConfig as cfg } from '../config'
import { RenderMapAssetsDefault } from './assets'
import { RenderMapLayers } from './layers'
//import { RenderMapMarkers } from './markers'
import { RenderMapObjects } from './objects'
import { RenderMapSymbols } from './symbols'

export function RenderMapCommon() {
  return (
    <>
      <RenderMapAssetsDefault />
      <g id={cfg.map} className="map">
        <RenderMapLayers mapLayers={cfg.getMapLayers()} />
        <RenderMapObjects mapObjects={cfg.getMapObjects()} />
        <RenderMapSymbols mapSymbols={cfg.getMapSymbols()} />
        {/*
        <RenderMapMarkers {...props} mapMarkers={cfg.getMapMarkers()} />
        */}
      </g>
    </>
  )
}
