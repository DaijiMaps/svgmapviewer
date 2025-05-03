/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-mixed-types */
import { create } from 'zustand'
import { persist, StorageValue } from 'zustand/middleware'

interface Likes {
  ids: Set<number>
  like: (id: number) => void
  unlike: (id: number) => void
  isLiked: (id: number) => boolean
}

export const useLikes = create<Likes>()(
  persist(
    (set, get) => ({
      ids: new Set<number>(),
      like: (id) => set({ ids: get().ids.add(id) }),
      unlike: (id) =>
        set(() => {
          const s = get()
          s.ids.delete(id) // returns boolean
          return { ids: s.ids }
        }),
      isLiked: (id) => {
        return get().ids.has(id)
      },
    }),
    {
      name: 'likes',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) {
            return null
          }
          const val = JSON.parse(str)
          return {
            ...val,
            state: {
              ...val.state,
              ids: new Set(val.state.ids),
            },
          }
        },
        setItem: (name, newVal: Readonly<StorageValue<Likes>>) => {
          const str = JSON.stringify({
            ...newVal,
            state: {
              ...newVal.state,
              ids: Array.from(newVal.state.ids.keys()),
            },
          })
          localStorage.setItem(name, str)
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
        },
      },
    }
  )
)
