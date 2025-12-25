/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import type { Req } from './floors-worker-types'
import { floorsWorkerSend, floorsWorkerStart } from './floors-worker-xstate'

onmessage = (e: Readonly<MessageEvent<Req>>): void => floorsWorkerSend(e.data)

floorsWorkerStart()
