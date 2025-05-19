import { createActor } from 'xstate'
import { svgMapViewerConfig as cfg } from './config'
import { SearchRes } from './types'
import { uiMachine } from './ui-xstate'

export const uiActor = createActor(uiMachine)
cfg.searchEndCbs.add(uiDetail)
cfg.uiOpenDoneCbs.add(uiOpen)
cfg.uiCloseCbs.add(uiCancel)
uiActor.on('CLOSE.DONE', closeDone)
uiActor.start()

function uiDetail(res: Readonly<null | SearchRes>) {
  if (res !== null) {
    uiActor.send({ type: 'DETAIL', ...res })
  }
}
function uiOpen(ok: boolean) {
  uiActor.send({ type: ok ? 'OPEN' : 'CANCEL' })
}
function uiCancel() {
  uiActor.send({ type: 'CANCEL' })
}
function closeDone() {
  cfg.uiCloseDoneCbs.forEach((cb) => cb())
}
