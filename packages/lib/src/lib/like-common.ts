/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { createStore } from '@xstate/store'
import { useSelector } from '@xstate/store/react'

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
    ...val,
    ids: Array.from(val.ids),
  }
}

function stringifyContext(val: Readonly<LikesContext>) {
  return JSON.stringify(externalizeContext(val))
}

// eslint-disable-next-line functional/functional-parameters
function loadContext() {
  const str = localStorage.getItem(LOCALSTORAGE_KEY)
  const val = parseContext(str)
  return val === undefined ? emptyContext : val
}

function saveContext(val: Readonly<LikesContext>): void {
  localStorage.setItem(LOCALSTORAGE_KEY, stringifyContext(val))
}

const likesStore = createStore({
  context: loadContext(),
  on: {
    like: (context, event: Readonly<{ id: ID }>) => ({
      ...context,
      // eslint-disable-next-line functional/immutable-data
      ids: new Set(context.ids.add(event.id)),
    }),
    unlike: (context, event: Readonly<{ id: ID }>) => {
      // eslint-disable-next-line functional/immutable-data
      context.ids.delete(event.id) // returns boolean
      return { ...context, ids: new Set(context.ids) }
    },
  },
})

likesStore.subscribe((s) => saveContext(s.context))

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
export function useLikes(): Set<ID> {
  return useSelector(likesStore, (s) => s.context.ids)
}
