/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { createAtom, type Atom } from '@xstate/store'

export const debugStringAtom: Atom<string[]> = createAtom<[]>([])

export function appendDebug(s: string): void {
  debugStringAtom.set((prev) => [...prev, s])
}
