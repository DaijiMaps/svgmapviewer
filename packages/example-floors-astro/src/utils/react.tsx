import type { ReactNode } from 'react'

import type { Info, XProps, XRenderer, XRendererMap, XTag } from './types'

export function makeRenderInfo(renderers: XRendererMap) {
  function RenderInfo<K extends XTag>(props: Readonly<XProps<K> & { tag: K }>) {
    const XRenderInfo: XRenderer<K> = renderers[props.tag]
    return <XRenderInfo title={props.title} x={props.x} />
  }
  return (props: Readonly<{ info: Info }>): ReactNode => {
    return (
      <RenderInfo
        tag={props.info.x.tag}
        title={props.info.title}
        x={props.info.x}
      />
    )
  }
}
