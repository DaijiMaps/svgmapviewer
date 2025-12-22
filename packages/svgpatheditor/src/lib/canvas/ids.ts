/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { createAtom } from '@xstate/store'

export type ID = number

const idsAtom = createAtom(0)

export function makeID(): ID {
  const maxID = idsAtom.get()
  const id = maxID + 1
  idsAtom.set(id)
  return id
}
