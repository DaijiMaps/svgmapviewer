import type { ReactNode } from 'react'
import { type Info } from 'svgmapviewer'

import type {
  TaggedProps,
  TaggedRenderer,
  TaggedRendererMap,
  TaggedTag,
} from '../../utils/tag'
import { type XInfo } from './schema'

declare module 'svgmapviewer' {
  interface Info {
    readonly x: XInfo
  }
}

export { type Info }

export type XTag = XInfo['tag']
export type XProps<K extends XTag> = Readonly<
  Omit<Info, 'x'> & {
    readonly x: Extract<XInfo, { readonly tag: K }>
  }
>
export type Renderer<K extends XTag> = (props: XProps<K>) => ReactNode
export type RendererMap = {
  readonly [K in XTag]: Renderer<K>
}

////

export type XTag2 = TaggedTag<XTag, Info, 'x'>
export type XProps2<K extends XTag2> = TaggedProps<XTag, Info, 'x', K>
export type XRenderer2<K extends XTag2> = TaggedRenderer<
  XTag,
  Info,
  'x',
  K,
  ReactNode
>
export type XRendererMap2 = TaggedRendererMap<XTag, Info, 'x', ReactNode>
