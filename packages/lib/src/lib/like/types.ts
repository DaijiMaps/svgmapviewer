import type z from 'zod'

/* eslint-disable functional/no-return-void */
export type ID = number | string

export interface LikesContext {
  ids: Set<ID>
}

export interface LikesExternalContext {
  ids: ID[]
}

export interface LikesReturn {
  like: (id: ID) => void
  unlike: (id: ID) => void
  isLiked: (id: ID) => boolean
}

export type Decode = (
  jsonstr: string,
  params?: z.core.ParseContext<z.core.$ZodIssue>
) => Readonly<LikesContext>

export type Encode = (
  context: Readonly<LikesContext>,
  params?: z.core.ParseContext<z.core.$ZodIssue>
) => string
