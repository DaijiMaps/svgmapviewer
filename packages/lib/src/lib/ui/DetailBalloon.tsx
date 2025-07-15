/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { RenderMapAssetsDefault } from '../carto/assets'
import { useShadowRoot } from '../dom'
import { Balloon, DetailBalloonStyle } from './Balloon'
import { Detail } from './Detail'
import { calcBalloonLayout } from './balloon'
import { useDetail } from './ui-xstate'

export function DetailBalloon(): ReactNode {
  useShadowRoot('detail', <DetailBalloonContent />, 'ui')

  return <div id="detail" />
}

export function DetailBalloonContent(): ReactNode {
  return (
    <div className="ui-content detail-balloon">
      <BalloonDetailStyle />
      <Assets />
    </div>
  )
}

function BalloonDetailStyle() {
  const detail = useDetail()

  const props = calcBalloonLayout(detail)

  return (
    <>
      <Balloon {...props} />
      <Detail _detail={detail} />
      <DetailBalloonStyle {...props} />
    </>
  )
}

function Assets() {
  return (
    <svg id="ui-svg-defs">
      <defs>
        <RenderMapAssetsDefault />
      </defs>
    </svg>
  )
}
