import type { Floor, FloorsConfig } from '../../../types'
import type { Cb } from '../../cb'

export interface FloorsContext {
  nurls: number
  urls: Set<string>
  fidx: number
  prevFidx: null | number
}

export type Init = { type: 'INIT'; fcfg: FloorsConfig; base?: string }
export type Select = { type: 'SELECT'; idx: number; force?: boolean }
export type SelectDone = { type: 'SELECT.DONE'; idx: number }
export type Image = { type: 'IMAGE'; name: string; url: string }
export type Click = { type: 'CLICK'; idx: number }
export type LevelUp = { type: 'LEVEL.UP' }
export type LevelDown = { type: 'LEVEL.DOWN' }
export type AnimationEnd = { type: 'ANIMATION.END'; idx: number }
export type FloorsEvents =
  | Init
  | Select
  | SelectDone
  | Image
  | Click
  | LevelUp
  | LevelDown
  | AnimationEnd
export type InitDone = {
  type: 'INIT.DONE'
  fcfg: FloorsConfig
  base?: string
}
export type Lock = { type: 'LOCK'; idx: number }
export type FloorsEmits = InitDone | Lock | SelectDone

export type FidxToOnAnimationEnd = (fidx: number, idx: number) => undefined | Cb
export type FidxToOnClick = (
  fidx: number,
  prevFidx: null | number,
  idx: number
) => undefined | Cb

//// XXX

type F = Required<Pick<Floor, 'name' | 'href'>>

export function floorUrls(fcfg: FloorsConfig): readonly F[] {
  return fcfg.floors
    .concat(fcfg.layers ?? [])
    .flatMap(({ name, href }): readonly F[] =>
      href === undefined ? [] : [{ name, href }]
    )
}

export function prefixUrl(href: Readonly<string | URL>, base?: string): string {
  // XXX
  // XXX
  // XXX de-duplicate slashes
  // XXX
  // XXX
  return ((base ?? '') + href).replace(/\/+/g, '/')
}
