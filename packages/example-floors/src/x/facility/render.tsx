import { type ReactNode } from 'react'
import { type FacilityInfo } from './types'
import { type Info } from 'svgmapviewer'

export function RenderFacility(
  props: Readonly<{ info: Info; facility: FacilityInfo }>
): ReactNode {
  return (
    <>
      <p>
        {props.facility.tag}:{props.facility.kind.tag}
      </p>
      <p>{props.info.title}</p>
    </>
  )
}
