/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-conditional-statements */

import { type RefObject } from 'react'

import {
  FLOOR_APPEARING,
  FLOOR_DISAPPEARING,
  floor_switch_duration,
} from '../../css'
import { useStyleRef } from '../../style/ref'

export const floorRefs: Map<string, SVGGElement | HTMLDivElement> = new Map()

export function useFloorRef(
  ref: Readonly<RefObject<SVGGElement | HTMLDivElement | null>>,
  name: string
): void {
  useStyleRef(floorRefs, ref, name)
}

function initStyle(
  e: Readonly<SVGGElement | HTMLDivElement>,
  _name: string
): void {
  const p = e.style.setProperty.bind(e.style)
  p(`will-change`, null)
  p(`animation`, null)
  p(`visibility`, 'hidden')
}

function loadStyle(
  e: Readonly<SVGGElement | HTMLDivElement>,
  appearing: boolean,
  _name: string
): void {
  const p = e.style.setProperty.bind(e.style)
  if (appearing) {
    p(`will-change`, `opacity`)
    p(`animation`, `${FLOOR_APPEARING} ${floor_switch_duration} linear`)
    p(`visibility`, null)
  } else {
    p(`will-change`, null)
    p(`animation`, null)
    p(`visibility`, 'hidden')
  }
}

function switchStyle(
  e: Readonly<SVGGElement | HTMLDivElement>,
  animating: boolean,
  appearing: boolean,
  _name: string
): void {
  const p = e.style.setProperty.bind(e.style)
  if (!animating) {
    const visibility = appearing ? null : 'hidden'
    p(`will-change`, null)
    p(`animation`, null)
    p(`visibility`, visibility)
  } else {
    const animation = `${appearing ? FLOOR_APPEARING : FLOOR_DISAPPEARING} ${floor_switch_duration} linear`
    p(`will-change`, `opacity`)
    p(`animation`, animation)
    p(`visibility`, null)
  }
}

export function updateFloorRefsInit(): void {
  Array.from(floorRefs, ([name, e]) => initStyle(e, name))
}

export function updateFloorRefsLoad(fidx: number): void {
  const re = new RegExp(`^.*-${fidx}$`)
  Array.from(floorRefs, ([name, e]) => loadStyle(e, re.test(name), name))
}

export function updateFloorRefsSwitch(
  fidx: number,
  prevFidx: number | null
): void {
  const re = new RegExp(`^.*-${fidx}$`)
  Array.from(floorRefs, ([name, e]) =>
    switchStyle(e, prevFidx !== null, re.test(name), name)
  )
}
