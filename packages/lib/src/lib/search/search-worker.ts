/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { type SearchWorkerReq } from './search-worker-types'
import {
  searchWorkerActorSend,
  searchWorkerActorStart,
} from './search-worker-xstate'

onmessage = (e: Readonly<MessageEvent<SearchWorkerReq>>): void =>
  searchWorkerActorSend(e.data)

searchWorkerActorStart()
