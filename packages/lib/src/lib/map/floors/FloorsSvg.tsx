/* eslint-disable functional/no-expression-statements */
import { Fragment, useRef, type PropsWithChildren, type ReactNode } from 'react'

import { type OsmRenderMapProps } from '../../../types'
import { floor_appearing_animation } from '../../css'
import { useLayout2 } from '../../style/style-react'
import {
  useFloors,
  type UseFloorsReturn,
} from '../../viewer/floors/floors-react'
import { useFloorRef } from '../../viewer/floors/style'
import { MAP_SVG_FLOORS } from '../map-svg-react'
import type { FloorProps } from './types'

export function RenderFloorsSvg({
  floors,
  ...rest
}: Readonly<OsmRenderMapProps>): ReactNode {
  const ctx = useFloors()
  return (
    <div className="content map-floors-svg">
      <RenderFloorsSvgSvg>
        {floors?.floors.map((_, fidx) => (
          <Fragment key={fidx}>
            <RenderFloorSvg fidx={fidx} {...rest} ctx={ctx} />
          </Fragment>
        ))}
      </RenderFloorsSvgSvg>
      <style>{svgStyle}</style>
    </div>
  )
}

const svgStyle = `
svg.content-svg {
  width: var(--layout-scroll-width);
  height: var(--layout-scroll-height);
}
${floor_appearing_animation}
`

function RenderFloorsSvgSvg(props: Readonly<PropsWithChildren>): ReactNode {
  const { viewBox } = useLayout2()

  // only this part is re-rendered after zoom (viewbox change)
  return (
    <svg id={MAP_SVG_FLOORS} className="content-svg" viewBox={viewBox}>
      {props.children}
    </svg>
  )
}

function RenderFloorSvg({
  fidx,
  data: { origViewBox },
  ctx: { fidxToOnAnimationEnd, urls },
}: Readonly<
  { fidx: number } & OsmRenderMapProps & { ctx: UseFloorsReturn }
>): ReactNode {
  const ref = useRef(null)
  useFloorRef(ref, `svg-${fidx}`)
  return (
    <g
      ref={ref}
      className={`floor fidx-${fidx}`}
      onAnimationEnd={fidxToOnAnimationEnd(fidx)}
    >
      <RenderFloorImage
        origViewBox={origViewBox}
        fidx={fidx}
        url={urls.get(fidx)}
        onAnimationEnd={fidxToOnAnimationEnd(fidx)}
      />
    </g>
  )
}

function RenderFloorImage({ origViewBox, url }: FloorProps): ReactNode {
  // XXX better "loading" display?
  return (
    <image
      href={url}
      x={origViewBox.x}
      y={origViewBox.y}
      width={origViewBox.width}
      height={origViewBox.height}
    />
  )
}
