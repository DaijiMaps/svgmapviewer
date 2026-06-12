/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
import { useRef, type ReactNode } from 'react'

import { svgMapViewerConfig as cfg } from '../../config'
import {
  box_sizing_border_box,
  pointer_events_initial,
  position_absolute_left_0_top_0,
  user_select_none,
  Z_INDEX_DETAIL,
} from '../css'
import { useOnWheel } from '../wheel'
import type { BalloonProps } from './Balloon'
import { useBalloonStyleRef } from './style'
import { useScrollStyleRef, useDetailStyleRef } from './style'
import { type UiDetailContent } from './ui-types'
import { isDetailEmpty, uiSend } from './ui-xstate'

export function Detail(
  props: Readonly<{ _detail: UiDetailContent; _balloon?: BalloonProps }>
): ReactNode {
  const ref = useRef<HTMLDivElement>(null)

  useOnWheel(ref)

  useBalloonStyleRef(ref, 'detail')
  useDetailStyleRef(ref, 'detail')
  useScrollStyleRef(ref, 'detail')

  return (
    <div
      ref={ref}
      className="detail"
      onAnimationEnd={() => uiSend({ type: 'DETAIL.ANIMATION.END' })}
    >
      {cfg.RenderInfo && !isDetailEmpty(props._detail) && (
        <cfg.RenderInfo info={props._detail.info} />
      )}
      <style>{style}</style>
    </div>
  )
}

const style = `
.detail {
  ${position_absolute_left_0_top_0}
  width: 50vmin;
  height: 50vmin;
  padding: 0.5em;
  overflow-x: hidden;
  overflow-y: scroll;
  ${pointer_events_initial}
  ${box_sizing_border_box}
  z-index: ${Z_INDEX_DETAIL};
  will-change: opacity, transform;
  cursor: default;
  touch-action: pan-y;
  overscroll-behavior-x: none;
  overscroll-behavior-y: none;
  scrollbar-width: none;
  &.like {
    pointer-events: initial;
  }
  &.liked {
    color: orange;
  }
  & h1,
  & h2,
  & h3,
  & h4 {
    ${user_select_none}
    margin: 1.5em;
    text-align: center;
  }
  & p {
    ${user_select_none}
    margin: 0.5em;
  }
  & a {
    text-decoration: none;
  }
  & table, & tbody, & th, & tr, & td {
  }
}

#ui-svg-defs {
  display: none;
}
`
