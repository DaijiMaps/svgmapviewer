import z from 'zod'
import { json } from '../json'
import type { LikesContext, LikesExternalContext } from './types'

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

export const decodeContext: (
  jsonstr: string,
  params?: z.core.ParseContext<z.core.$ZodIssue>
) => Readonly<LikesContext> = schema.decode

export const encodeContext: (
  context: Readonly<LikesContext>,
  params?: z.core.ParseContext<z.core.$ZodIssue>
) => string = schema.encode
