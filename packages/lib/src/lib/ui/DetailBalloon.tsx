/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'

import { RenderMapAssetsDefault } from '../carto/assets'
import { useShadowRoot } from '../dom'
import { Balloon, type BalloonProps } from './Balloon'
import { balloonStyle, calcBalloonLayout } from './balloon-common'
import { Detail } from './Detail'
import { useDetail, useOpenCloseDetail } from './ui-react'

export function DetailBalloon(): ReactNode {
  useShadowRoot('detail', <DetailBalloonRoot />, 'ui')

  return <div id="detail" />
}

export function DetailBalloonRoot(): ReactNode {
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
      <Style {...props} />
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

function Style({ _p, _hv, _size, _leg }: Readonly<BalloonProps>): ReactNode {
  const detail = useOpenCloseDetail()

  return <style>{balloonStyle(detail, _p, _hv, _size, _leg)}</style>
}
