/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-return-void */
import { createElement } from 'react'
import type {
  Info,
  RenderInfo,
  SvgMapViewerConfig,
  SvgMapViewerConfigUser,
} from './types'

const renderInfoDefault: RenderInfo = (props: Readonly<{ info: Info }>) =>
  createElement('p', {}, props.info.title)

export let svgMapViewerConfig: SvgMapViewerConfig = {
  root: 'root',
  map: 'map',
  href: 'map.svg',
  width: 0,
  height: 0,
  fontSize: 16,
  origViewBox: { x: 0, y: 0, width: 0, height: 0 },
  title: 'svgmapviewer',
  subtitle: 'An (opinionated) interactive SVG map viewer',
  copyright: '@ Daiji Maps',
  zoomFactor: 2,
  animationDuration: 625,
  dragStepAlpha: 0.2,
  dragStepStepLimit: 10,
  dragStepMaxCount: 100,
  searchStartCbs: [],
  searchCbs: [],
  searchDoneCbs: [],
  searchEndCbs: [],
  uiOpenCbs: [],
  uiOpenDoneCbs: [],
  uiCloseCbs: [],
  uiCloseDoneCbs: [],
  renderInfo: renderInfoDefault,
}

export function updateSvgMapViewerConfig(
  configUser: Readonly<SvgMapViewerConfigUser>
): void {
  svgMapViewerConfig = {
    ...svgMapViewerConfig,
    ...(configUser as SvgMapViewerConfig),
  }
}
