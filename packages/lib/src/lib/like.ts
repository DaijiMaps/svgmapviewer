/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { createStore, StoreSnapshot } from '@xstate/store'
import { useSelector } from '@xstate/store/react'

interface LikeSContext {
  ids: Set<number>
}

const emptySnapshot = {
  context: {
    ids: new Set<number>(),
  },
}

// XXX JSON schema
function parseSnapshot(str: null | string) {
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

function stringifySnapshot(val: Readonly<StoreSnapshot<LikeSContext>>) {
  return JSON.stringify({
    ...val,
    context: {
      ...val.context,
      ids: Array.from(val.context.ids.keys()),
    },
  })
}

function loadSnapshot() {
  const str = localStorage.getItem('svgmapviewer:likes')
  const val = parseSnapshot(str)
  return val === undefined ? emptySnapshot : val
}

function saveSnapshot(val: Readonly<StoreSnapshot<LikeSContext>>) {
  localStorage.setItem('svgmapviewer:likes', stringifySnapshot(val))
}

export const likesStore = createStore({
  context: loadSnapshot().context,
  on: {
    like: (context, event: Readonly<{ id: number }>) => ({
      ...context,
      ids: context.ids.add(event.id),
    }),
    unlike: (context, event: Readonly<{ id: number }>) => {
      context.ids.delete(event.id) // returns boolean
      return { ...context, ids: context.ids }
    },
  },
})

likesStore.subscribe(saveSnapshot)

export function useLikes() {
  const context = useSelector(likesStore, (state) => state.context)
  return {
    like: (id: number) => likesStore.trigger.like({ id }),
    unlike: (id: number) => likesStore.trigger.unlike({ id }),
    isLiked: (id: number): boolean => context.ids.has(id),
  }
}
