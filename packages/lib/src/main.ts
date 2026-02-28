/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { svgMapViewerConfig, updateSvgMapViewerConfig } from './config'
import { type BoxBox } from './lib/box/prefixed'
import { notifyGlobal } from './lib/event-global'
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

// eslint-disable-next-line functional/functional-parameters
function greet(): void {
  console.group()
  console.log('Welcome to svgmapviewer!')
  console.log('Version:', process.env.VERSION)
  console.log('GitHub:', process.env.GITHUB)
  console.groupEnd()
}

export function svgmapviewer(
  configUser: Readonly<SvgMapViewerConfigUser>
): void {
  startAllCbs()
  startAllActors()

  const config = updateConfig(configUser)

  notifyGlobal.init(config)

  greet()
  root(config)
  styleRoot()
}
