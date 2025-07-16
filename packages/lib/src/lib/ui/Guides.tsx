/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { svgMapViewerConfig } from '../../config'
import {
  pointer_events_none,
  position_absolute_left_0_top_0,
  user_select_none,
  width_100vw_height_100svh,
  Z_INDEX_GUIDES,
} from '../css'
import { useShadowRoot } from '../dom'
import {
  GuidesAnimationStyle,
  Measure,
  MeasureCoordinate,
  MeasureDistance,
} from './Measure'

export function Guides(): ReactNode {
  useShadowRoot('guides', <GuidesContent />, 'ui')

  return <div id="guides" />
}

function GuidesContent(): ReactNode {
  return svgMapViewerConfig.mapCoord.matrix.isIdentity ? (
    <></>
  ) : (
    <div className="ui-content guides">
      <svg className="guides">
        <Measure />
      </svg>
      <MeasureDistance />
      <MeasureCoordinate />
      <style>
        {style}
        <GuidesAnimationStyle />
      </style>
    </div>
  )
}

const style = `
.guides {
  ${position_absolute_left_0_top_0}
  ${width_100vw_height_100svh}
  ${pointer_events_none}
  z-index: ${Z_INDEX_GUIDES};
}

text {
  ${user_select_none}
}
`
