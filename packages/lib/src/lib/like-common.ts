/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { createStore, createStoreConfig } from '@xstate/store'
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

function parseContext(str: null | string): undefined | LikesContext {
  if (!str) {
    return undefined
  }
  const val = JSON.parse(str)
  // XXX validate
  if (
    !(typeof val === 'object') ||
    !('ids' in val) ||
    !(val.ids instanceof Array)
  ) {
    return undefined
  }
  return {
    ...val,
    ids: new Set(val.ids),
  }
}

function externalizeContext(val: Readonly<LikesContext>): LikesExternalContext {
  return {
    ids: Array.from(val.ids),
  }
}

function stringifyContext(val: Readonly<LikesContext>) {
  return JSON.stringify(externalizeContext(val))
}

function loadContext(key: string) {
  const str = localStorage.getItem(key)
  const val = parseContext(str)
  return val === undefined ? emptyContext : val
}

function saveContext(key: string, val: Readonly<LikesContext>): void {
  localStorage.setItem(key, stringifyContext(val))
}

const makeLikesStoreConfig = (key: string) =>
  createStoreConfig({
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

const likesStore = createStore(makeLikesStoreConfig(LOCALSTORAGE_KEY))

export function like(id: ID): void {
  return likesStore.trigger.like({ id })
}
export function unlike(id: ID): void {
  return likesStore.trigger.unlike({ id })
}
export function isLiked(id: ID): boolean {
  return likesStore.getSnapshot().context.ids.has(id)
}

// eslint-disable-next-line functional/functional-parameters
export function useLikes(): { ids: Set<ID> } {
  const store = useStore(makeLikesStoreConfig(LOCALSTORAGE_KEY))

  const ids = useSelector(store, (s) => s.context.ids)

  return {
    ids,
  }
}
