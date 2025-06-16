/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { Balloon, BalloonStyle } from './Balloon'
import { RenderMapAssetsDefault } from './lib/carto/assets'
import { svgMapViewerConfig as cfg } from './lib/config'
import {
  box_sizing_border_box,
  pointer_events_initial,
  position_absolute_left_0_top_0,
  user_select_none,
  Z_INDEX_DETAIL,
} from './lib/css'
import { diag } from './lib/diag'
import { useShadowRoot } from './lib/dom'
import { isDetailEmpty, uiSend, useDetail } from './lib/ui-xstate'

export function Detail(): ReactNode {
  useShadowRoot('detail', <DetailContent />, 'ui')

  return <div id="detail" />
}

export function DetailContent(): ReactNode {
  const detail = useDetail()

  const p = detail.p
  const layout = detail.layout

  const dir = diag(detail.layout.container, p)

  const W = layout.container.width
  const H = layout.container.height

  return (
    <div className="ui-content detail-balloon">
      <Balloon _p={p} _dir={dir} _W={W} _H={H} />
      <div
        className="detail"
        // eslint-disable-next-line functional/no-return-void
        onAnimationEnd={() => uiSend({ type: 'DETAIL.ANIMATION.END' })}
      >
        {cfg.renderInfo &&
          !isDetailEmpty(detail) &&
          cfg.renderInfo({ info: detail.info })}
        <DetailStyle />
      </div>
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

export function DetailStyle(): ReactNode {
  const detail = useDetail()

  const p = detail.p
  const layout = detail.layout

  const dir = diag(detail.layout.container, p)

  const W = layout.container.width
  const H = layout.container.height

  return <BalloonStyle _p={p} _dir={dir} _W={W} _H={H} />
}

function Assets(): ReactNode {
  return (
    <svg id="ui-svg-defs">
      <defs>
        <RenderMapAssetsDefault />
      </defs>
    </svg>
  )
}
