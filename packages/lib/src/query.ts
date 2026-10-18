/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { createAtom, type Atom } from '@xstate/store'
import { Schema } from 'effect'

type Obj = Readonly<Record<string, string>>
type Val = Readonly<{
  latitude?: number
  longitude?: number
  accuracy?: number
  mode?: string
}>

export const queryAtom: Atom<undefined | Val> = createAtom(undefined)

const latitudeSchema = Schema.NumberFromString.check(
  Schema.makeFilter((n) => n >= -90 && n <= 90)
)
const longitudeSchema = Schema.NumberFromString.check(
  Schema.makeFilter((n) => n >= -180 && n <= 180)
)
const accuracySchema = Schema.NumberFromString

const querySchema = Schema.Struct({
  latitude: Schema.optional(latitudeSchema),
  longitude: Schema.optional(longitudeSchema),
  accuracy: Schema.optional(accuracySchema),
  mode: Schema.optional(Schema.String),
})

export function saveQuery(): undefined | Val {
  const sparams = new URLSearchParams(window.location.search)
  const obj: Obj = Object.fromEntries(sparams.entries())
  const res = Schema.decodeUnknownExit(querySchema)(obj)
  if (res._tag === 'Success') {
    queryAtom.set(() => res.value)
  } else {
    console.log('query', res)
  }
  return queryAtom.get()
}
