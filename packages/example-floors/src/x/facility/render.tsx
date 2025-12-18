import { type ReactNode } from 'react'
import { type FacilityKind } from './types'
import { type Info } from 'svgmapviewer'
import { RenderStairs } from './stairs/render'
import { RenderToilet } from './toilet/render'

export function RenderFacility(
  props: Readonly<{ info: Info; kind: FacilityKind }>
): ReactNode {
  return (
    <>
      <p>
        {props.info.x.tag}:{props.kind.tag}
      </p>
      <p>{props.info.title}</p>
      {props.kind.tag === 'stairs' ? (
        <RenderStairs {...props.kind} />
      ) : props.kind.tag === 'toilet' ? (
        <RenderToilet {...props.kind} />
      ) : (
        <></>
      )}
    </>
  )
}
