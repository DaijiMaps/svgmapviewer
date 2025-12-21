export type ID = number | string

export interface LikesContext {
  ids: Set<ID>
}

export interface LikesExternalContext {
  ids: ID[]
}
