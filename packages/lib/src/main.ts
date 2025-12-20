/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { svgMapViewerConfig, updateSvgMapViewerConfig } from './config'
import { notifyInit } from './event-global'
import { type BoxBox } from './lib/box/prefixed'
import { styleRoot } from './lib/style/Style'
import { isUiRendered } from './lib/ui/Ui'
import { isContainerRendered } from './lib/viewer/Container'
import { startAllActors } from './main-actors'
import { startAllCbs } from './main-cbs'
import { root } from './Root'
import { type SvgMapViewerConfig, type SvgMapViewerConfigUser } from './types'

function updateConfig(
  configUser: Readonly<SvgMapViewerConfigUser>
): SvgMapViewerConfig {
  const origViewBox: BoxBox = {
    x: 0,
    y: 0,
    width: typeof configUser.width === 'number' ? configUser.width : 0,
    height: typeof configUser.height === 'number' ? configUser.height : 0,
  }

  updateSvgMapViewerConfig({
    origViewBox,
    isContainerRendered,
    isUiRendered,
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

  return config
}

export function svgmapviewer(
  configUser: Readonly<SvgMapViewerConfigUser>
): void {
  startAllCbs()
  startAllActors()

  const config = updateConfig(configUser)

  notifyInit(config)

  root(config)
  styleRoot()
}
