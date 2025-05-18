/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { root } from '../Root'
import { styleRoot } from '../Style'
import { Box } from './box/main'
import { svgMapViewerConfig, updateSvgMapViewerConfig } from './config'
import { searchSearchDone, searchSearchStart } from './search'
import { SvgMapViewerConfig, SvgMapViewerConfigUser } from './types'

export function svgmapviewer(configUser: Readonly<SvgMapViewerConfigUser>) {
  const origViewBox: Box = {
    x: 0,
    y: 0,
    width: typeof configUser.width === 'number' ? configUser.width : 0,
    height: typeof configUser.height === 'number' ? configUser.height : 0,
  }

  updateSvgMapViewerConfig({
    origViewBox,
    ...configUser,
  })

  updateSvgMapViewerConfig({
    ...svgMapViewerConfig,
  })

  const config: SvgMapViewerConfig = {
    ...svgMapViewerConfig,
    origViewBox,
    ...configUser,
  }

  svgMapViewerConfig.searchStartCbs.add(searchSearchStart)
  svgMapViewerConfig.searchDoneCbs.add(searchSearchDone)

  root(config)
  styleRoot()
}
