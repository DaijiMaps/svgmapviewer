import type { XInfo } from './schema'
import type { Info, XRenderer, XRendererMap, XTag } from './types'

export function makeRenderInfo(m: XRendererMap) {
  function XRenderInfo<K extends XTag>(
    props: Readonly<{
      tag: K
      title: string
      x: Extract<XInfo, { tag: K }>
    }>
  ) {
    const Component = m[props.tag] as XRenderer<K>
    return <Component title={props.title} x={props.x} />
  }
  return (props: Readonly<{ info: Info }>) => {
    return (
      <XRenderInfo
        tag={props.info.x.tag}
        title={props.info.title}
        x={props.info.x}
      />
    )
  }
}
