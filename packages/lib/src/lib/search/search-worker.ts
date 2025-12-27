/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { x } from './search-worker-context'
import { type SearchWorkerReq } from './search-worker-types'
import {
  searchWorkerActorSend,
  searchWorkerActorStart,
} from './search-worker-xstate'

// eslint-disable-next-line functional/immutable-data
x.onmessage = (e: Readonly<MessageEvent<SearchWorkerReq>>): void =>
  searchWorkerActorSend(e.data)

searchWorkerActorStart()
