/* eslint-disable functional/functional-parameters */
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
import { queryAtom, saveQuery } from './query'
import { root } from './Root'
import { type SvgMapViewerConfig, type SvgMapViewerConfigUser } from './types'

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

  const url = new URL(document.location.href)
  const params = url.searchParams

  greet()
  saveQuery()
  const query = queryAtom.get()
  if (query && query.latitude !== undefined && query.longitude !== undefined) {
    setPosition(query.latitude, query.longitude, query.accuracy)
  }
  if (params.get('info')) {
    infoRoot(config)
  } else {
    root(config)
  }
}
