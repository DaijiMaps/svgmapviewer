/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { type SearchWorkerReq } from './search-worker-types'
import {
  searchWorkerActorSend,
  searchWorkerActorStart,
} from './search-worker-xstate'

onmessage = function (e: Readonly<MessageEvent<SearchWorkerReq>>) {
  searchWorkerActorSend(e.data)
}

searchWorkerActorStart()
