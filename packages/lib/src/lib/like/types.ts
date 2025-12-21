/* eslint-disable functional/no-return-void */
export type ID = number | string

export interface LikesContext {
  ids: Set<ID>
}

export interface LikesExternalContext {
  ids: ID[]
}

// eslint-disable-next-line functional/no-mixed-types
export interface LikesReturn {
  ids: Set<ID>
  like: (id: ID) => void
  unlike: (id: ID) => void
  isLiked: (id: ID) => boolean
}
