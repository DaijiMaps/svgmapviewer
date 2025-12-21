/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { createStoreConfig } from '@xstate/store'
import { useSelector, useStore } from '@xstate/store/react'
import { loadContext, saveContext } from './storage'
import type { ID, LikesContext, LikesReturn } from './types'

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
      like: (context, event, q) => {
        q.emit.updated(context)
        const ids = new Set(context.ids.add(event.id))
        return { ...context, ids }
      },
      unlike: (context, event, q) => {
        q.emit.updated(context)
        context.ids.delete(event.id)
        const ids = new Set(context.ids)
        return { ...context, ids }
      },
    },
  })
}

export function useLikes(): LikesReturn {
  const store = useStore(makeLikesStoreConfig(LOCALSTORAGE_KEY))

  const ids = useSelector(store, (s) => s.context.ids)

  return {
    like: (id: ID) => store.trigger.like({ id }),
    unlike: (id: ID) => store.trigger.unlike({ id }),
    isLiked: (id: ID) => ids.has(id),
  }
}
