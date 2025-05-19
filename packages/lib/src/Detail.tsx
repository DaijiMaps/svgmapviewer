import { useSelector } from '@xstate/react'
import { useMemo } from 'react'
import { Balloon, BalloonStyle } from './Balloon'
import './Detail.css'
import { svgMapViewerConfig as cfg } from './lib/config'
import { diag } from './lib/diag'
import { fromSvg } from './lib/layout'
import { pointerActor } from './lib/pointer-react'
import { selectLayout } from './lib/pointer-xstate'
import { selectDetail, uiActor } from './lib/ui-xstate'

export function Detail() {
  const detail = useSelector(uiActor, selectDetail)

  // XXX
  const layout = useSelector(pointerActor, selectLayout)

  const p = useMemo(
    () => (detail === null ? null : fromSvg(detail.psvg, layout)),
    [detail, layout]
  )
  const dir = useMemo(
    () => (p === null ? null : diag(layout.container, p)),
    [layout, p]
  )
  const W = useMemo(() => layout.container.width, [layout])
  const H = useMemo(() => layout.container.height, [layout])

  return (
    <div className="detail-balloon">
      <Balloon _detail={detail} _p={p} _dir={dir} _W={W} _H={H} />
      <BalloonStyle _detail={detail} _p={p} _dir={dir} _W={W} _H={H} />
      <div
        className="detail"
        // eslint-disable-next-line functional/no-return-void
        onAnimationEnd={() => uiActor.send({ type: 'DETAIL.ANIMATION.END' })}
      >
        {cfg.renderInfo &&
          detail &&
          detail.info &&
          cfg.renderInfo({ info: detail.info })}
      </div>
    </div>
  )
}
