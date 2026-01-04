/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { createStoreConfig } from '@xstate/store'
import { useSelector, useStore } from '@xstate/store/react'

import type { ID, LikesContext, LikesReturn } from './types'

import { loadContext, saveContext } from './storage'

const LOCALSTORAGE_KEY = 'svgmapviewer:likes'

type Events = {
  like: Readonly<{ id: ID }>
  unlike: Readonly<{ id: ID }>
}

type Emits = {
  updated: Readonly<LikesContext>
}

function makeLikesStoreConfig(key: string) {
  return createStoreConfig<LikesContext, Events, Emits>({
    context: loadContext(key),
    emits: {
      updated: (context) => saveContext(key, context),
    },
    on: {
      like: (prev, event, q) => {
        const ids = new Set(prev.ids.add(event.id))
        const context = { ...prev, ids }
        q.emit.updated(context)
        return context
      },
      unlike: (prev, event, q) => {
        prev.ids.delete(event.id)
        const ids = new Set(prev.ids)
        const context = { ...prev, ids }
        q.emit.updated(context)
        return context
      },
    },
  })
}

export function useLikes(key?: string): LikesReturn {
  const store = useStore(makeLikesStoreConfig(key ?? LOCALSTORAGE_KEY))

  const ids = useSelector(store, (s) => s.context.ids)

  return {
    like: (id: ID) => store.trigger.like({ id }),
    unlike: (id: ID) => store.trigger.unlike({ id }),
    isLiked: (id: ID) => ids.has(id),
  }
}
