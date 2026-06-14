/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'

import { type OsmRenderMapProps } from '../../../types'
import { RenderFloorsHtml } from './FloorsHtml'
import { RenderFloorsSvg } from './FloorsSvg'

export function RenderFloors(props: Readonly<OsmRenderMapProps>): ReactNode {
  return (
    <>
      <RenderFloorsSvg {...props} />
      <RenderFloorsHtml {...props} />
    </>
  )
}

// XXX check if all urls are loaded?
export function isFloorsRendered(): boolean {
  return true
}
