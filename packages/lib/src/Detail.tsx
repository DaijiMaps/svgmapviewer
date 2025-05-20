import { useSelector } from '@xstate/react'
import { Balloon, BalloonStyle } from './Balloon'
import './Detail.css'
import { svgMapViewerConfig as cfg } from './lib/config'
import { diag } from './lib/diag'
import { openCloseIsVisible } from './lib/openclose'
import { selectDetail, selectOpenCloseDetail, uiActor } from './lib/ui-xstate'

export function Detail() {
  const detail = useSelector(uiActor, selectDetail)
  const oc = useSelector(uiActor, selectOpenCloseDetail)

  const p = detail?.p ?? null
  const layout = detail?.layout ?? null

  const dir =
    p === null || detail === null || detail.layout === null
      ? null
      : diag(detail.layout.container, p)

  const W = layout?.container.width ?? null
  const H = layout?.container.height ?? null

  return (
    <div
      className="detail-balloon"
      style={{
        // XXX overidden when detail/balloon is open
        display: detail !== null && openCloseIsVisible(oc) ? 'initial' : 'none',
      }}
    >
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
