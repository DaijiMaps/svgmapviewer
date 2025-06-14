/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { Balloon, BalloonStyle } from './Balloon'
import { svgMapViewerConfig as cfg } from './lib/config'
import {
  box_sizing_border_box,
  pointer_events_initial,
  position_absolute_left_0_top_0,
  user_select_none,
  Z_INDEX_DETAIL,
} from './lib/css'
import { diag } from './lib/diag'
import { isDetailEmpty, uiSend, useDetail } from './lib/ui-xstate'

export function Detail(): ReactNode {
  const detail = useDetail()

  const p = detail.p
  const layout = detail.layout

  const dir = diag(detail.layout.container, p)

  const W = layout.container.width
  const H = layout.container.height

  return (
    <div className="ui-content detail-balloon">
      <Balloon _detail={detail} _p={p} _dir={dir} _W={W} _H={H}></Balloon>
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
`

export function DetailStyle(): ReactNode {
  const detail = useDetail()

  const p = detail.p
  const layout = detail.layout

  const dir = diag(detail.layout.container, p)

  const W = layout.container.width
  const H = layout.container.height

  return <BalloonStyle _detail={detail} _p={p} _dir={dir} _W={W} _H={H} />
}
