/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { createStoreConfig } from '@xstate/store'
import { useSelector, useStore } from '@xstate/store/react'

const LOCALSTORAGE_KEY = 'svgmapviewer:likes'

type ID = number | string

interface LikesContext {
  ids: Set<ID>
}

interface LikesExternalContext {
  ids: ID[]
}

const emptyContext = {
  ids: new Set<ID>(),
}

function parseContext(jsonstr: null | string): undefined | LikesContext {
  if (!jsonstr) {
    return undefined
  }
  const val = JSON.parse(jsonstr)
  // XXX validate
  if (
    !(typeof val === 'object') ||
    !('ids' in val) ||
    !(val.ids instanceof Array)
  ) {
    return undefined
  }
  return {
    ids: new Set(val.ids),
  }
}

function externalizeContext(
  context: Readonly<LikesContext>
): LikesExternalContext {
  return {
    ids: Array.from(context.ids),
  }
}

function stringifyContext(context: Readonly<LikesContext>) {
  return JSON.stringify(externalizeContext(context))
}

function loadContext(key: string): LikesContext {
  const str = localStorage.getItem(key)
  const context = parseContext(str)
  return context === undefined ? emptyContext : context
}

function saveContext(key: string, context: Readonly<LikesContext>): void {
  localStorage.setItem(key, stringifyContext(context))
}

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
        return {
          ...context,
          // eslint-disable-next-line functional/immutable-data
          ids: new Set(context.ids.add(event.id)),
        }
      },
      unlike: (context, event: Readonly<{ id: ID }>, q) => {
        q.emit.updated(context)
        // eslint-disable-next-line functional/immutable-data
        context.ids.delete(event.id) // returns boolean
        return { ...context, ids: new Set(context.ids) }
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
