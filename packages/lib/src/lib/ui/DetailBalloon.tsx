/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { useMemo, type ReactNode } from 'react'

import { RenderMapAssetsDefault } from '../carto/assets'
import { useShadowRoot } from '../dom'
import { Balloon } from './Balloon'
import { calcBalloonLayout, detailStyleString } from './balloon-common'
import { Detail } from './Detail'
import { useDetail } from './ui-react'

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

  const props = useMemo(() => calcBalloonLayout(detail), [detail])

  return (
    <>
      <Balloon {...props} />
      <Detail {...props} _detail={detail} />
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
