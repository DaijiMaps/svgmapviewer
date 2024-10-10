import { useSelector } from '@xstate/react'
import { Balloon, BalloonStyle } from './Balloon'
import './Detail.css'
import { svgMapViewerConfig } from './lib/config'
import { PointerRef } from './lib/pointer-xstate'
import { selectDetail, UiRef } from './lib/ui-xstate'

export interface DetailProps {
  _uiRef: UiRef
  _pointerRef: PointerRef
}

export function Detail(props: Readonly<DetailProps>) {
  const detail = useSelector(props._uiRef, selectDetail)

  return (
    <div className="content">
      <Balloon _uiRef={props._uiRef} _pointerRef={props._pointerRef} />
      <BalloonStyle _uiRef={props._uiRef} />
      <div
        className="detail"
        // eslint-disable-next-line functional/no-return-void
        onAnimationEnd={() =>
          props._uiRef.send({ type: 'DETAIL.ANIMATION.END' })
        }
      >
        {svgMapViewerConfig.renderInfo &&
          detail &&
          detail.info &&
          svgMapViewerConfig.renderInfo({ info: detail.info })}
      </div>
    </div>
  )
}
