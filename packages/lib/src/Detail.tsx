import { useSelector } from '@xstate/react'
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

  const layout = useSelector(props._pointerRef, selectLayout)

  if (detail === null) {
    return <></>
  }

  const p = fromSvg(detail.psvg, layout)
  const dir = diag(layout.container, p)

  return detail === null ? (
    <></>
  ) : (
    <div className="content">
      <Balloon
        _uiRef={props._uiRef}
        _pointerRef={props._pointerRef}
        _detail={detail}
        _p={p}
        _dir={dir}
      />
      <BalloonStyle
        _uiRef={props._uiRef}
        _pointerRef={props._pointerRef}
        _detail={detail}
        _p={p}
        _dir={dir}
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
