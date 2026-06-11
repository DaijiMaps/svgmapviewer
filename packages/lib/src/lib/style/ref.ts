/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
import { useEffect, type RefObject } from 'react'

export type StyleRefMap<E = HTMLElement> = Readonly<Map<string, E>>
export type StyleRef<E = HTMLElement> = Readonly<RefObject<E | null>>

export function makeStyleRef<E = HTMLElement>(): StyleRefMap<E> {
  return new Map()
}

export function useStyleRef<E = HTMLElement>(
  refMap: StyleRefMap<E>,
  ref: StyleRef<E>,
  name: string
): void {
  useEffect(() => {
    const e = ref.current
    if (e) refMap.set(name, e)
    return () => {
      if (e) refMap.delete(name)
    }
  }, [name, ref, refMap])
}
