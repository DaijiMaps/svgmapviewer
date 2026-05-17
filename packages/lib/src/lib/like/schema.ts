import { Schema } from 'effect'

import { json } from '../json'
import type {
  Decode,
  Encode,
  LikesContext,
  LikesExternalContext,
} from './types'

//// string -> LikesExternalContext

const XIDSchema = Schema.Union([Schema.Number, Schema.String])
const XIDSetSchema = Schema.Array(XIDSchema)
const XContextSchema = Schema.Struct({ ids: XIDSetSchema })

const parse = json(XContextSchema)

//// LikesExternalContext -> LikesContext

const decodeExternalContext = (
  context: Readonly<LikesExternalContext>
): LikesContext => ({
  ids: new Set(context.ids),
})

const encodeExternalContext = (
  context: Readonly<LikesContext>
): LikesExternalContext => ({
  ids: Array.from(context.ids),
})

export const decodeContext: Decode = (jsonstr, params) =>
  decodeExternalContext(Schema.decodeUnknownSync(parse)(jsonstr, params))
export const encodeContext: Encode = (context, params) =>
  Schema.encodeSync(parse)(encodeExternalContext(context), params)
