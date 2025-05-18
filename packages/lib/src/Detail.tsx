import { useSelector } from '@xstate/react'
import { useMemo } from 'react'
import { Balloon, BalloonStyle } from './Balloon'
import './Detail.css'
import { svgMapViewerConfig as cfg } from './lib/config'
import { diag } from './lib/diag'
import { fromSvg } from './lib/layout'
import { PointerRef, selectLayout } from './lib/pointer-xstate'
import { UiRef, selectDetail } from './lib/ui-xstate'

export interface DetailProps {
  _uiRef: UiRef
  _pointerRef: PointerRef
}

export function Detail(props: Readonly<DetailProps>) {
  const detail = useSelector(props._uiRef, selectDetail)

  // XXX
  const layout = useSelector(props._pointerRef, selectLayout)

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

  if (detail === null || p === null || dir === null) {
    return <></>
  }

  return (
    <div>
      <Balloon
        _uiRef={props._uiRef}
        _detail={detail}
        _p={p}
        _dir={dir}
        _W={W}
        _H={H}
      />
      <BalloonStyle
        _uiRef={props._uiRef}
        _detail={detail}
        _p={p}
        _dir={dir}
        _W={W}
        _H={H}
      />
      <div
        className="detail"
        // eslint-disable-next-line functional/no-return-void
        onAnimationEnd={() =>
          props._uiRef.send({ type: 'DETAIL.ANIMATION.END' })
        }
      >
        {cfg.renderInfo && detail.info && cfg.renderInfo({ info: detail.info })}
      </div>
    </div>
  )
}
