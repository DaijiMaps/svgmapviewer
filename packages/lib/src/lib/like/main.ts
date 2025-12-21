/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { createStoreConfig } from '@xstate/store'
import { useSelector, useStore } from '@xstate/store/react'
import { loadContext, saveContext } from './storage'
import type { ID, LikesContext } from './types'

const LOCALSTORAGE_KEY = 'svgmapviewer:likes'

////

function makeLikesStoreConfig(key: string) {
  return createStoreConfig({
    context: loadContext(key),
    emits: {
      updated: (context: Readonly<LikesContext>) => {
        saveContext(key, context)
      },
    },
    on: {
      like: (context, event: Readonly<{ id: ID }>, q) => {
        q.emit.updated(context)
        // eslint-disable-next-line functional/immutable-data
        const ids = new Set(context.ids.add(event.id))
        return { ...context, ids }
      },
      unlike: (context, event: Readonly<{ id: ID }>, q) => {
        q.emit.updated(context)
        // eslint-disable-next-line functional/immutable-data
        context.ids.delete(event.id) // returns boolean
        const ids = new Set(context.ids)
        return { ...context, ids }
      },
    },
  })
}

// eslint-disable-next-line functional/no-mixed-types
export interface LikesReturn {
  ids: Set<ID>
  like: (id: ID) => void
  unlike: (id: ID) => void
  isLiked: (id: ID) => boolean
}

// eslint-disable-next-line functional/functional-parameters
export function useLikes(): LikesReturn {
  const store = useStore(makeLikesStoreConfig(LOCALSTORAGE_KEY))

  const ids = useSelector(store, (s) => s.context.ids)

  return {
    ids,
    like: (id: ID) => store.trigger.like({ id }),
    unlike: (id: ID) => store.trigger.unlike({ id }),
    isLiked: (id: ID) => ids.has(id),
  }
}
