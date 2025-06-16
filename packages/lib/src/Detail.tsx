/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { Balloon, DetailBalloonStyle } from './Balloon'
import { calcBalloonLayout } from './lib/balloon'
import { RenderMapAssetsDefault } from './lib/carto/assets'
import { svgMapViewerConfig as cfg } from './lib/config'
import {
  box_sizing_border_box,
  pointer_events_initial,
  position_absolute_left_0_top_0,
  user_select_none,
  Z_INDEX_DETAIL,
} from './lib/css'
import { useShadowRoot } from './lib/dom'
import type { UiDetailContent } from './lib/ui-types'
import { isDetailEmpty, uiSend, useDetail } from './lib/ui-xstate'

export function DetailBalloon(): ReactNode {
  useShadowRoot('detail', <DetailBalloonContent />, 'ui')

  return <div id="detail" />
}

export function DetailBalloonContent(): ReactNode {
  const detail = useDetail()

  const props = calcBalloonLayout(detail)

  return (
    <div className="ui-content detail-balloon">
      <Balloon {...props} />
      <Detail _detail={detail} />
      <DetailBalloonStyle {...props} />
    </div>
  )
}

function Detail(props: Readonly<{ _detail: UiDetailContent }>): ReactNode {
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
