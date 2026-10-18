/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { getConfig, setConfig } from './config'
import { gameRoot } from './Game'
import { infoRoot } from './Info'
import { type BoxBox } from './lib/box/prefixed'
import { notifyGlobal } from './lib/event-global'
import { setPosition } from './lib/position/position-xstate'
import { isUiRendered } from './lib/ui/Ui'
import { isContainerRendered } from './lib/viewer/Container'
import { startAllActors } from './main-actors'
import { startAllCbs } from './main-cbs'
import { saveQuery } from './query'
import { root } from './Root'
import { settingsRoot } from './Settings'
import { type SvgMapViewerConfig, type SvgMapViewerConfigUser } from './types'
import { version } from './version'

// XXX
// XXX
// XXX
// XXX
// XXX
function updateConfig(
  configUser: Readonly<SvgMapViewerConfigUser>
): SvgMapViewerConfig {
  const origViewBox: BoxBox = {
    x: 0,
    y: 0,
    width: typeof configUser.width === 'number' ? configUser.width : 0,
    height: typeof configUser.height === 'number' ? configUser.height : 0,
  }

  setConfig({
    origViewBox,
    isContainerRendered,
    isUiRendered,
    ...configUser,
  })

  const config: SvgMapViewerConfig = {
    ...getConfig(),
    origViewBox,
    ...configUser,
  }

  return config
}
// XXX
// XXX
// XXX
// XXX
// XXX

export function svgmapviewer(
  configUser: Readonly<SvgMapViewerConfigUser>
): void {
  version()

  const query = saveQuery()

  if (!window.name) window.name = 'main'

  startAllCbs()
  startAllActors()

  const config = updateConfig(configUser)

  notifyGlobal.init(config)

  // actions
  if (query?.latitude && query?.longitude) {
    setPosition(query.latitude, query.longitude, query.accuracy)
  }

  if (query?.mode === 'info') {
    infoRoot(config)
  } else if (query?.mode === 'settings') {
    settingsRoot(config)
  } else if (query?.mode === 'game') {
    gameRoot(config)
  } else {
    root(config)
  }
}
