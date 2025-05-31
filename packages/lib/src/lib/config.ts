/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-return-void */
import { createElement } from 'react'
import { emptyMapData } from './geo/data'
import {
  type Info,
  type RenderInfo,
  type SvgMapViewerConfig,
  type SvgMapViewerConfigUser,
} from './types'
import { type VecVec } from './vec/prefixed'

const renderInfoDefault: RenderInfo = (
  props: Readonly<{ info: Readonly<Info> }>
) => createElement('p', {}, props.info.title)

function mapCoordDefault(p: VecVec): VecVec {
  return p
}

// XXX
// XXX migrate to configActor
// XXX
export let svgMapViewerConfig: SvgMapViewerConfig = {
  root: 'root',
  map: 'map',
  href: 'map.svg',
  width: 0,
  height: 0,
  fontSize: 16,
  origViewBox: { x: 0, y: 0, width: 0, height: 0 },
  title: 'svgmapviewer',
  subtitle:
    'svgmapviewer - An (opinionated) interactive offline SVG map viewer',
  copyright: '@ Daiji Maps',
  zoomFactor: 2,
  animationDuration: 625,
  dragStepAlpha: 0.375,
  dragStepStepLimit: 10,
  dragStepMaxCount: 100,
  scrollIdleTimeout: 1000,
  getMapLayers: () => [],
  getMapObjects: () => [],
  getMapSymbols: () => [],
  getMapMarkers: () => [],
  renderInfo: renderInfoDefault,
  mapData: emptyMapData,
  mapCoord: {
    fromGeo: mapCoordDefault,
    toGeo: mapCoordDefault,
    matrix: new DOMMatrixReadOnly(),
  },
  mapHtmlStyle: '',
  mapSymbols: [],
  mapNames: [],
}

export function updateSvgMapViewerConfig(
  configUser: Readonly<SvgMapViewerConfigUser>
): void {
  svgMapViewerConfig = {
    ...svgMapViewerConfig,
    ...(configUser as SvgMapViewerConfig),
  }
}

////
