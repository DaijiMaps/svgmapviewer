/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { ctx } from './floors-worker-context'
import type { Req } from './floors-worker-types'
import { floorsWorkerSend, floorsWorkerStart } from './floors-worker-xstate'

// eslint-disable-next-line functional/immutable-data
ctx.onmessage = (e: Readonly<MessageEvent<Req>>): void =>
  floorsWorkerSend(e.data)

floorsWorkerStart()
