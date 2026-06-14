/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'

import { RenderMapAssetsDefault } from '../carto/assets'
import { useShadowRoot } from '../dom'
import { Balloon } from './Balloon'
import { balloonStyleString } from './balloon-common'
import { Detail } from './Detail'

export function DetailBalloon(): ReactNode {
  useShadowRoot('detail', <DetailBalloonRoot />, 'ui')

  return <div id="detail" />
}

export function DetailBalloonRoot(): ReactNode {
  return (
    <div className="ui-content detail-balloon">
      <Balloon />
      <Detail />
      <style>{balloonStyleString}</style>
      <Assets />
    </div>
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
