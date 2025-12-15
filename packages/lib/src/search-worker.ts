/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import type { SearchWorkerReq } from './lib/search/search-worker-types'
import { searchWorkerActorSend } from './lib/search/search-worker-xstate'

onmessage = function (e: Readonly<MessageEvent<SearchWorkerReq>>) {
  searchWorkerActorSend(e.data)
}
