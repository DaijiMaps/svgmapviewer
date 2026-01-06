/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { type SearchWorker, type SearchWorkerRes } from './search-worker-types'
import { handleSearchRes, searchSend } from './search-xstate'

const worker: SearchWorker = new Worker(
  new URL('./search-worker.js', import.meta.url),
  {
    type: 'module',
  }
)

worker.onmessage = (e: Readonly<MessageEvent<SearchWorkerRes>>) => {
  const ev = e.data
  switch (ev.type) {
    case 'INIT.DONE':
      searchSend({ type: 'INIT.DONE' })
      break
    case 'SEARCH.DONE':
      handleSearchRes(ev.res)
      break
    case 'SEARCH.ERROR':
      console.log('search error!', ev.error)
      searchSend({ type: 'SEARCH.DONE', res: null })
      break
  }
}

worker.onerror = (ev) => {
  console.error('search error', ev)
}

worker.onmessageerror = (ev) => {
  console.error('search messageerror', ev)
}

export { worker as searchWorker }
