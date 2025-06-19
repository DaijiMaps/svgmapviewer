/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { Balloon, DetailBalloonStyle } from './Balloon'
import { Detail } from './Detail'
import { calcBalloonLayout } from './lib/balloon'
import { useShadowRoot } from './lib/dom'
import { useDetail } from './lib/ui-xstate'

export function DetailBalloon(): ReactNode {
  useShadowRoot('detail', <DetailBalloonContent />, 'ui')

  return <div id="detail" />
}

export function DetailBalloonContent(): ReactNode {
  const detail = useDetail()

  const layout = calcBalloonLayout(detail)
  /*
  const size = calcBalloonSize(layout._W, layout._H)
  if (layout._hv === null) {
    return <></>
  }
  const leg = layoutLeg(layout._hv, size.bw, size.bh, size.ll)
  */

  return (
    <div className="ui-content detail-balloon">
      <Balloon {...layout} />
      <Detail _detail={detail} />
      <DetailBalloonStyle {...layout} />
    </div>
  )
}
