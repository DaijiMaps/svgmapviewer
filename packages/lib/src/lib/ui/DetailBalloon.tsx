/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'

import { RenderMapAssetsDefault } from '../carto/assets'
import { useShadowRoot } from '../dom'
import { Balloon } from './Balloon'
import { detailStyleString } from './balloon-common'
import { Detail } from './Detail'
import { useBalloon, useDetail } from './ui-xstate'

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
  const balloon = useBalloon()

  return (
    <>
      <Balloon _detail={detail} _balloon={balloon} />
      <Detail _detail={detail} _balloon={balloon} />
      <style>{detailStyleString}</style>
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
