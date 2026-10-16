/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { getConfig, setConfig } from './config'
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

  startAllCbs()
  startAllActors()

  const config = updateConfig(configUser)

  notifyGlobal.init(config)

  // actions
  if (query?.latitude && query?.longitude) {
    setPosition(query.latitude, query.longitude, query.accuracy)
  }

  if (query?.info) {
    infoRoot(config)
  } else {
    root(config)
  }
}
