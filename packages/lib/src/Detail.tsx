import { type ReactNode } from 'react'
import { Balloon, BalloonStyle } from './Balloon'
import './Detail.css'
import { svgMapViewerConfig as cfg } from './lib/config'
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
      <Balloon _detail={detail} _p={p} _dir={dir} _W={W} _H={H}>
        <BalloonStyle _detail={detail} _p={p} _dir={dir} _W={W} _H={H} />
      </Balloon>
      <div
        className="detail"
        // eslint-disable-next-line functional/no-return-void
        onAnimationEnd={() => uiSend({ type: 'DETAIL.ANIMATION.END' })}
      >
        {cfg.renderInfo &&
          !isDetailEmpty(detail) &&
          cfg.renderInfo({ info: detail.info })}
      </div>
    </div>
  )
}
