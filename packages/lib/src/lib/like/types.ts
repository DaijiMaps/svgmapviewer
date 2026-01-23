import type z from 'zod'

/* eslint-disable functional/no-return-void */
export type ID = number | string

export interface LikesContext {
  readonly ids: Set<ID>
}

export interface LikesExternalContext {
  readonly ids: ID[]
}

export interface LikesReturn {
  readonly like: (id: ID) => void
  readonly unlike: (id: ID) => void
  readonly isLiked: (id: ID) => boolean
}

export type Decode = (
  jsonstr: string,
  params?: z.core.ParseContext<z.core.$ZodIssue>
) => Readonly<LikesContext>

export type Encode = (
  context: Readonly<LikesContext>,
  params?: z.core.ParseContext<z.core.$ZodIssue>
) => string
