/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { createStore, type StoreSnapshot } from '@xstate/store'
import { useSelector } from '@xstate/store/react'

const LOCALSTORAGE_KEY = 'svgmapviewer:likes'

type ID = number | string

interface LikesContext {
  ids: Set<ID>
}

interface LikesExternalContext {
  ids: ID[]
}

const emptySnapshot = {
  context: {
    ids: new Set<ID>(),
  },
}

function parseSnapshot(
  str: null | string
): undefined | StoreSnapshot<LikesContext> {
  if (!str) {
    return undefined
  }
  const val = JSON.parse(str)
  // XXX validate
  if (
    !(typeof val === 'object') ||
    !('context' in val) ||
    !('ids' in val.context) ||
    !(val.context.ids instanceof Array)
  ) {
    return undefined
  }
  return {
    ...val,
    context: { ...val.context, ids: new Set(val.context.ids) },
  }
}

function externalizeSnapshot(
  val: Readonly<StoreSnapshot<LikesContext>>
): StoreSnapshot<LikesExternalContext> {
  return {
    ...val,
    context: {
      ...val.context,
      ids: Array.from(val.context.ids),
    },
  }
}

function stringifySnapshot(val: Readonly<StoreSnapshot<LikesContext>>) {
  return JSON.stringify(externalizeSnapshot(val))
}

// eslint-disable-next-line functional/functional-parameters
function loadSnapshot() {
  const str = localStorage.getItem(LOCALSTORAGE_KEY)
  const val = parseSnapshot(str)
  return val === undefined ? emptySnapshot : val
}

function saveSnapshot(val: Readonly<StoreSnapshot<LikesContext>>): void {
  localStorage.setItem(LOCALSTORAGE_KEY, stringifySnapshot(val))
}

const likesStore = createStore({
  context: loadSnapshot().context,
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

likesStore.subscribe(saveSnapshot)

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
