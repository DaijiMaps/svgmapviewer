/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-return-void */
import { createElement } from 'react'
import { configActor } from './config-xstate'
import { emptyMapData } from './geo/data'
import { Layout } from './layout'
import type {
  ConfigCb,
  Info,
  RenderInfo,
  SvgMapViewerConfig,
  SvgMapViewerConfigUser,
} from './types'
import { VecVec } from './vec/prefixed'

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

export function registerCbs(cbs: Readonly<Partial<ConfigCb>>) {
  configActor.send({ type: 'ADD.CB', ...cbs })
}

////

export function notifySearchStart(psvg: VecVec) {
  configActor.getSnapshot().context.searchStartCbs.forEach((cb) => cb(psvg))
}
export function notifySearch(psvg: VecVec) {
  configActor.getSnapshot().context.searchCbs.forEach((cb) => cb(psvg))
}
export function notifySearchEnd(psvg: VecVec, info: Readonly<Info>) {
  configActor
    .getSnapshot()
    .context.searchEndCbs.forEach((cb) => cb({ psvg, info }))
}
export function notifySearchEndDone(
  psvg: VecVec,
  info: Readonly<Info>,
  layout: Readonly<Layout>
) {
  configActor
    .getSnapshot()
    .context.searchEndDoneCbs.forEach((cb) => cb(psvg, info, layout))
}
export function notifyUiOpen(
  psvg: VecVec,
  info: Readonly<Info>,
  layout: Readonly<Layout>
) {
  configActor
    .getSnapshot()
    .context.uiOpenCbs.forEach((cb) => cb(psvg, info, layout))
}
export function notifyUiOpenDone(ok: boolean) {
  configActor.getSnapshot().context.uiOpenDoneCbs.forEach((cb) => cb(ok))
}
export function notifyUiClose() {
  configActor.getSnapshot().context.uiCloseCbs.forEach((cb) => cb())
}
export function notifyCloseDone() {
  configActor.getSnapshot().context.uiCloseDoneCbs.forEach((cb) => cb())
}
export function notifyZoomStart(
  layout: Readonly<Layout>,
  zoom: number,
  z: number
) {
  configActor
    .getSnapshot()
    .context.zoomStartCbs.forEach((cb) => cb(layout, zoom, z))
}
export function notifyZoomEnd(layout: Readonly<Layout>, zoom: number) {
  configActor.getSnapshot().context.zoomEndCbs.forEach((cb) => cb(layout, zoom))
}
export function notifyResize(layout: Readonly<Layout>, force: boolean) {
  configActor.send({ type: 'CONFIG.RESIZE', layout, force })
}
export function notifyLayout(layout: Readonly<Layout>, force: boolean) {
  configActor.send({ type: 'CONFIG.LAYOUT', layout, force })
}
