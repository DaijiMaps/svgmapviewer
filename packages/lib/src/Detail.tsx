/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { RenderMapAssetsDefault } from './lib/carto/assets'
import { svgMapViewerConfig as cfg } from './lib/config'
import {
  box_sizing_border_box,
  pointer_events_initial,
  position_absolute_left_0_top_0,
  user_select_none,
  Z_INDEX_DETAIL,
} from './lib/css'
import type { UiDetailContent } from './lib/ui-types'
import { isDetailEmpty, uiSend } from './lib/ui-xstate'

export function Detail(
  props: Readonly<{ _detail: UiDetailContent }>
): ReactNode {
  const { _detail } = props
  return (
    <div
      className="detail"
      // eslint-disable-next-line functional/no-return-void
      onAnimationEnd={() => uiSend({ type: 'DETAIL.ANIMATION.END' })}
    >
      {cfg.renderInfo &&
        !isDetailEmpty(_detail) &&
        cfg.renderInfo({ info: _detail.info })}
      <Assets />
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
  overflow: scroll;
  ${pointer_events_initial}
  ${box_sizing_border_box}
  z-index: ${Z_INDEX_DETAIL};
  will-change: opacity, transform;
  cursor: default;
  touch-action: none;
}

h3 {
  ${user_select_none}
  margin: 1.5em;
  text-align: center;
}

p {
  ${user_select_none}
  margin: 0.5em;
}

#ui-svg-defs {
  display: none;
}
`

function Assets(): ReactNode {
  return (
    <svg id="ui-svg-defs">
      <defs>
        <RenderMapAssetsDefault />
      </defs>
    </svg>
  )
}
