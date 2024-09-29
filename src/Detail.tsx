import { useSelector } from '@xstate/react'
import { Balloon, BalloonStyle } from './Balloon'
import './Detail.css'
import { svgMapViewerConfig } from './lib/config'
import { selectDetail } from './lib/react-ui'
import { Info } from './lib/types'
import { PointerRef } from './lib/xstate-pointer'
import { UiRef } from './lib/xstate-ui'

export interface DetailProps {
  _uiRef: UiRef
  _pointerRef: PointerRef
}

export function RenderInfoDefault(props: Readonly<{ info: Info }>) {
  return (
    <div className="detail">
      <h3>{props.info.title}</h3>
    </div>
  )
}

export function Detail(props: Readonly<DetailProps>) {
  const detail = useSelector(props._uiRef, selectDetail)

  return (
    <div className="content">
      <Balloon _uiRef={props._uiRef} _pointerRef={props._pointerRef} />
      <BalloonStyle _uiRef={props._uiRef} />
      <div className="detail">
        {svgMapViewerConfig.renderInfo &&
          detail &&
          detail.info &&
          svgMapViewerConfig.renderInfo({ info: detail.info })}
      </div>
    </div>
  )
}
