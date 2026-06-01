import type { ReactNode } from 'react'
import { type Info } from 'svgmapviewer'
import type {
  TaggedProps,
  TaggedRenderer,
  TaggedRendererMap,
  TaggedTag,
} from 'svgmapviewer-astro-floors'

import { type XInfo } from '../schema'

declare module 'svgmapviewer' {
  interface Info {
    readonly x: XInfo
  }
}

export { type Info }

export type XTag = TaggedTag<Info, 'x'>
export type XProps<K extends XTag> = TaggedProps<Info, 'x', K>
export type XRenderer<K extends XTag> = TaggedRenderer<Info, 'x', K, ReactNode>
export type XRendererMap = TaggedRendererMap<Info, 'x', ReactNode>
