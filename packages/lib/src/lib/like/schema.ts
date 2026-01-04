import z from 'zod'

import type {
  Decode,
  Encode,
  LikesContext,
  LikesExternalContext,
} from './types'

import { json } from '../json'

//// string -> LikesExternalContext

const XIDSchema = z.union([z.number(), z.string()])
const XIDSetSchema = z.array(XIDSchema)
const XContextSchema = z.object({ ids: XIDSetSchema })

const parse = json(XContextSchema)

//// LikesExternalContext -> LikesContext

const IDSchema = z.union([z.number(), z.string()])
const IDSetSchema = z.set(IDSchema)
const ContextSchema = z.object({ ids: IDSetSchema })

const conv = z.codec(XContextSchema, ContextSchema, {
  decode: (x: Readonly<LikesExternalContext>) => ({
    ids: new Set(x.ids),
  }),
  encode: (context: Readonly<LikesContext>) => ({
    ids: Array.from(context.ids),
  }),
})

//// string -> LikesContext

const schema = z.pipe(parse, conv)

export const decodeContext: Decode = (jsonstr, params) =>
  schema.decode(jsonstr, params)
export const encodeContext: Encode = (context, params) =>
  schema.encode(context, params)
