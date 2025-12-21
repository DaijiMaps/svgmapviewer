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

const toExternal = (context: Readonly<LikesContext>): LikesExternalContext => ({
  ids: Array.from(context.ids),
})
const fromExternal = (x: Readonly<LikesExternalContext>): LikesContext => ({
  ids: new Set(x.ids),
})

const emptyContext = {
  ids: new Set<ID>(),
}

function parseContext(jsonstr: null | string): undefined | LikesContext {
  if (!jsonstr) {
    return undefined
  }
  const jsonval = JSON.parse(jsonstr)
  // XXX validate
  if (
    !(typeof jsonval === 'object') ||
    !('ids' in jsonval) ||
    !(jsonval.ids instanceof Array)
  ) {
    return undefined
  }
  const x: LikesExternalContext = {
    ids: jsonval.ids,
  }
  return fromExternal(x)
}

function stringifyContext(context: Readonly<LikesContext>): string {
  return JSON.stringify(toExternal(context))
}

function loadContext(key: string): LikesContext {
  const str = localStorage.getItem(key)
  return parseContext(str) ?? emptyContext
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
