/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { useEffect, type RefObject } from 'react'

const cartoSymbolStyleRefs: Map<string, SVGUseElement> = new Map()

export function useCartoSymbolStyleRef(
  ref: Readonly<RefObject<SVGUseElement | null>>
): void {
  useEffect(() => {
    const e = ref.current
    if (e) cartoSymbolStyleRefs.set('map-symbols', e)
    return () => {
      if (e) cartoSymbolStyleRefs.delete('map-symbols')
    }
  }, [ref])
}
