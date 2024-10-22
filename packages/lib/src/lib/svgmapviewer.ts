/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { root } from '../Root'
import { Box } from './box/main'
import { svgMapViewerConfig, updateSvgMapViewerConfig } from './config'
import { configLayout, Layout, makeLayout } from './layout'
import { searchSearchDone, searchSearchStart } from './search'
import { SvgMapViewerConfig, SvgMapViewerConfigUser } from './types'

export function svgmapviewer(configUser: Readonly<SvgMapViewerConfigUser>) {
  const origViewBox: Box = {
    x: 0,
    y: 0,
    width: typeof configUser.width === 'number' ? configUser.width : 0,
    height: typeof configUser.height === 'number' ? configUser.height : 0,
  }

  const initialBody: Box = {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  }

  const initialStyle = getComputedStyle(document.body)

  updateSvgMapViewerConfig({
    origViewBox,
    ...configUser,
  })

  const initialLayout: Layout = makeLayout(
    configLayout(
      parseFloat(initialStyle.fontSize),
      svgMapViewerConfig.origViewBox,
      initialBody
    )
  )

  updateSvgMapViewerConfig({
    ...svgMapViewerConfig,
    layout: initialLayout,
  })

  const config: SvgMapViewerConfig = {
    ...svgMapViewerConfig,
    origViewBox,
    layout: initialLayout,
    ...configUser,
  }

  svgMapViewerConfig.searchStartCbs.add(searchSearchStart)
  svgMapViewerConfig.searchDoneCbs.add(searchSearchDone)

  root(config)
}
