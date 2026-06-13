/* eslint-disable functional/no-expression-statements */
import { Fragment, useRef, type PropsWithChildren, type ReactNode } from 'react'

import {
  type Floor,
  type LabelsMap,
  type OsmRenderMapProps,
} from '../../../types'
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
        {(floors?.floors ?? []).map((floor, idx) => (
          <Fragment key={idx}>
            <RenderFloorSvg
              floors={floors}
              {...rest}
              ctx={ctx}
              floor={floor}
              idx={idx}
              labelsMap={floors?.labelsMap}
            />
          </Fragment>
        ))}
      </RenderFloorsSvgSvg>
      <style>{`
svg.content-svg {
  width: var(--layout-scroll-width);
  height: var(--layout-scroll-height);
}
${floor_appearing_animation}
`}</style>
    </div>
  )
}

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
  data: { origViewBox },
  ctx: { fidxToOnAnimationEnd, urls },
  floor,
  idx,
  labelsMap,
}: Readonly<
  OsmRenderMapProps & { ctx: UseFloorsReturn } & {
    floor: Floor
    idx: number
    labelsMap: LabelsMap | undefined
  }
>): ReactNode {
  const ref = useRef(null)
  useFloorRef(ref, `svg-${idx}`)
  return (
    <g
      ref={ref}
      className={`floor fidx-${idx}`}
      onAnimationEnd={fidxToOnAnimationEnd(idx)}
    >
      <RenderFloorImage
        origViewBox={origViewBox}
        idx={idx}
        url={urls.get(idx)}
        onAnimationEnd={fidxToOnAnimationEnd(idx)}
        labels={floor.labels ?? labelsMap?.get(floor.name.toLowerCase())}
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
