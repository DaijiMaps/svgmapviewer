import type { ReactNode } from 'react'
import { type Info } from 'svgmapviewer'

import { type XInfo } from './schema'

declare module 'svgmapviewer' {
  interface Info {
    x: XInfo
  }
}

export { type Info }

export type XTag = XInfo['tag']
export type Renderer<K> = (
  props: Readonly<{ title: string; x: Extract<XInfo, { tag: K }> }>
) => ReactNode
export type RendererMap = {
  readonly [K in XTag]: Renderer<K>
}
