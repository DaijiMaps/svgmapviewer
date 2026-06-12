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

function initStyle(e: Readonly<SVGGElement | HTMLDivElement>): void {
  const s = e.style.setProperty.bind(e.style)
  s(`will-change`, null)
  s(`animation`, null)
  s(`visibility`, 'hidden')
}

function loadStyle(
  e: Readonly<SVGGElement | HTMLDivElement>,
  appearing: boolean
): void {
  const s = e.style.setProperty.bind(e.style)
  if (appearing) {
    s(`will-change`, `opacity`)
    s(`animation`, `${FLOOR_APPEARING} ${floor_switch_duration} linear`)
    s(`visibility`, null)
  } else {
    s(`will-change`, null)
    s(`animation`, null)
    s(`visibility`, 'hidden')
  }
}

function switchStyle(
  e: Readonly<SVGGElement | HTMLDivElement>,
  animating: boolean,
  appearing: boolean
): void {
  const s = e.style.setProperty.bind(e.style)
  if (!animating) {
    const visibility = appearing ? null : 'hidden'
    s(`will-change`, null)
    s(`animation`, null)
    s(`visibility`, visibility)
  } else {
    const animation = `${appearing ? FLOOR_APPEARING : FLOOR_DISAPPEARING} ${floor_switch_duration} linear`
    s(`will-change`, `opacity`)
    s(`animation`, animation)
    s(`visibility`, null)
  }
}

export function updateFloorRefsInit(): void {
  Array.from(floorRefs, ([, e]) => initStyle(e))
}

export function updateFloorRefsLoad(fidx: number): void {
  const re = new RegExp(`^.*-${fidx}$`)
  Array.from(floorRefs, ([name, e]) => loadStyle(e, re.test(name)))
}

export function updateFloorRefsSwitch(
  fidx: number,
  prevFidx: number | null
): void {
  const re = new RegExp(`^.*-${fidx}$`)
  Array.from(floorRefs, ([name, e]) =>
    switchStyle(e, prevFidx !== null, re.test(name))
  )
}
