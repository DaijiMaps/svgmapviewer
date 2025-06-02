/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { createStore, type StoreSnapshot } from '@xstate/store'
import { useSelector } from '@xstate/store/react'

interface LikesContext {
  ids: Set<number>
}

interface LikesExternalContext {
  ids: number[]
}

const emptySnapshot = {
  context: {
    ids: new Set<number>(),
  },
}

// XXX JSON schema
function parseSnapshot(
  str: null | string
): undefined | StoreSnapshot<LikesContext> {
  if (!str) {
    return undefined
  }
  const val = JSON.parse(str)
  if (!('context' in val) || !('ids' in val.context)) {
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
      ids: Array.from(val.context.ids.keys()),
    },
  }
}

function stringifySnapshot(val: Readonly<StoreSnapshot<LikesContext>>) {
  return JSON.stringify(externalizeSnapshot(val))
}

// eslint-disable-next-line functional/functional-parameters
function loadSnapshot() {
  const str = localStorage.getItem('svgmapviewer:likes')
  const val = parseSnapshot(str)
  return val === undefined ? emptySnapshot : val
}

function saveSnapshot(val: Readonly<StoreSnapshot<LikesContext>>): void {
  localStorage.setItem('svgmapviewer:likes', stringifySnapshot(val))
}

const likesStore = createStore({
  context: loadSnapshot().context,
  on: {
    like: (context, event: Readonly<{ id: number }>) => ({
      ...context,
      // eslint-disable-next-line functional/immutable-data
      ids: new Set(Array.from(context.ids.add(event.id))),
    }),
    unlike: (context, event: Readonly<{ id: number }>) => {
      // eslint-disable-next-line functional/immutable-data
      context.ids.delete(event.id) // returns boolean
      return { ...context, ids: new Set(Array.from(context.ids)) }
    },
  },
})

likesStore.subscribe(saveSnapshot)

export const like = (id: number): void => likesStore.trigger.like({ id })
export const unlike = (id: number): void => likesStore.trigger.unlike({ id })
export const isLiked = (id: number): boolean => {
  return likesStore.getSnapshot().context.ids.has(id)
}

// eslint-disable-next-line functional/functional-parameters
export function useLikes(): Set<number> {
  return useSelector(likesStore, (s) => s.context.ids)
}
