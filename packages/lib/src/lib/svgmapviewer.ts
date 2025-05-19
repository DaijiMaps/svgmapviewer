/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { root } from '../Root'
import { styleRoot } from '../Style'
import { Box } from './box/main'
import {
  configActor,
  svgMapViewerConfig,
  updateSvgMapViewerConfig,
} from './config'
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

  configActor.send({
    type: 'ADD.CB',
    searchStartCb: searchSearchStart,
    searchDoneCb: searchSearchDone,
  })
  svgMapViewerConfig.searchStartCbs.add(searchSearchStart)
  svgMapViewerConfig.searchDoneCbs.add(searchSearchDone)

  // eslint-disable-next-line functional/no-conditional-statements
  if (configUser.mapNames) {
    configActor.send({ type: 'SET.MAPNAMES', mapNames: configUser.mapNames })
  }

  root(config)
  styleRoot()
}
