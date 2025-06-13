/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { Balloon, BalloonStyle } from './Balloon'
import { svgMapViewerConfig as cfg } from './lib/config'
import { position_absolute_left_0_top_0, user_select_none } from './lib/css'
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
    <div className="detail-balloon">
      <Balloon _detail={detail} _p={p} _dir={dir} _W={W} _H={H}></Balloon>
      <div
        className="detail"
        // eslint-disable-next-line functional/no-return-void
        onAnimationEnd={() => uiSend({ type: 'DETAIL.ANIMATION.END' })}
      >
        {cfg.renderInfo &&
          !isDetailEmpty(detail) &&
          cfg.renderInfo({ info: detail.info })}
      </div>
      <style>{style}</style>
    </div>
  )
}

const style = `
.content {
  overflow: hidden;
}

.detail {
  ${position_absolute_left_0_top_0}
  width: 50vmin;
  height: 50vmin;
  padding: 0.5em;
  overflow: scroll;
  pointer-events: initial;
  box-sizing: border-box;
  z-index: 11;
}

h3,
p {
  ${user_select_none}
}

h3 {
  margin: 1.5em;
  text-align: center;
}

p {
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
