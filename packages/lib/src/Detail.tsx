import { useSelector } from '@xstate/react'
import { useMemo } from 'react'
import { Balloon, BalloonStyle } from './Balloon'
import './Detail.css'
import { svgMapViewerConfig as cfg } from './lib/config'
import { diag } from './lib/diag'
import { selectDetail, uiActor } from './lib/ui-xstate'

export function Detail() {
  const detail = useSelector(uiActor, selectDetail)

  const p = detail?.p ?? null
  const layout = detail?.layout ?? null

  const dir = useMemo(
    () =>
      p === null || detail === null || detail.layout === null
        ? null
        : diag(detail.layout.container, p),
    [detail, p]
  )
  const W = useMemo(() => layout?.container.width ?? null, [layout])
  const H = useMemo(() => layout?.container.height ?? null, [layout])

  return (
    <div className="detail-balloon">
      {p !== null && W !== null && H !== null && (
        <Balloon _detail={detail} _p={p} _dir={dir} _W={W} _H={H}>
          <BalloonStyle _detail={detail} _p={p} _dir={dir} _W={W} _H={H} />
        </Balloon>
      )}
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
