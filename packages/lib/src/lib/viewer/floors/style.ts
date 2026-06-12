/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-conditional-statements */

import { useEffect, type RefObject } from 'react'

import {
  FLOOR_APPEARING,
  FLOOR_DISAPPEARING,
  floor_switch_duration,
} from '../../css'

export const floorRefs: Map<string, SVGGElement | HTMLDivElement> = new Map()

export function useFloorRef(
  ref: Readonly<RefObject<SVGGElement | HTMLDivElement | null>>,
  name: string
): void {
  useEffect(() => {
    const e = ref.current
    if (e) floorRefs.set(name, e)
    return () => {
      if (e) floorRefs.delete(name)
    }
  }, [name, ref])
}

export function updateFloorRefsInit(): void {
  Array.from(floorRefs, ([, e]) => {
    const s = e.style.setProperty.bind(e.style)
    s(`will-change`, null)
    s(`animation`, null)
    s(`visibility`, 'hidden')
  })
}

export function updateFloorRefsLoad(fidx: number): void {
  const re = new RegExp(`^.*-${fidx}$`)
  Array.from(floorRefs, ([name, e]) => {
    const s = e.style.setProperty.bind(e.style)
    if (re.test(name)) {
      s(`will-change`, `opacity`)
      s(`animation`, `${FLOOR_APPEARING} ${floor_switch_duration} linear`)
      s(`visibility`, null)
    } else {
      s(`will-change`, null)
      s(`animation`, null)
      s(`visibility`, 'hidden')
    }
  })
}

export function updateFloorRefsSwitch(
  fidx: number,
  prevFidx: number | null
): void {
  const re = new RegExp(`^.*-${fidx}$`)
  Array.from(floorRefs, ([name, e]) => {
    const s = e.style.setProperty.bind(e.style)
    if (prevFidx === null) {
      const visibility = re.test(name) ? null : 'hidden'
      s(`will-change`, null)
      s(`animation`, null)
      s(`visibility`, visibility)
    } else {
      const animation = `${re.test(name) ? FLOOR_APPEARING : FLOOR_DISAPPEARING} ${floor_switch_duration} linear`
      s(`will-change`, `opacity`)
      s(`animation`, animation)
      s(`visibility`, null)
    }
  })
}
