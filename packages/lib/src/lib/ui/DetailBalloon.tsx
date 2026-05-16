/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { useMemo, type ReactNode } from 'react'

import { RenderMapAssetsDefault } from '../carto/assets'
import { useShadowRoot } from '../dom'
import { Balloon } from './Balloon'
import { calcBalloonLayout } from './balloon-common'
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
      <style>{style}</style>
    </>
  )
}

const style = `
.detail.not-animating {
  transform-origin: 0 0;
  transform: translate(var(--tx1-x), var(--tx1-y)) scale(var(--s-b)) translate(-50%, -50%) translate3d(0px, 0px, 0px);
}
.balloon.not-animating {
  transform-origin: 0 0;
  transform: translate(var(--tx1-x), var(--tx1-y)) scale(var(--s-b)) translate(var(--pww), var(--phh)) translate3d(0px, 0px, 0px);
}

.detail.animating,
.balloon.animating {
  transform-origin: 0 0;
  will-change: opacity, transform;
}
.detail.animating {
  animation: xxx-detail var(--duration) var(--timing);
}
.balloon.animating {
  animation: xxx-balloon var(--duration) var(--timing);
}

@keyframes xxx-detail {
  from {
    opacity: var(--o-a);
    transform: translate(var(--tx1-a-x), var(--tx1-a-y)) scale(var(--s-a)) translate(-50%, -50%) translate3d(0px, 0px, 0px);
  }
  to {
    opacity: var(--o-b);
    transform: translate(var(--tx1-b-x), var(--tx1-b-y)) scale(var(--s-b)) translate(-50%, -50%) translate3d(0px, 0px, 0px);
  }
}

@keyframes xxx-balloon {
  from {
    opacity: var(--o-a);
    transform: translate(var(--tx1-a-x), var(--tx1-a-y)) scale(var(--s-a)) translate(var(--pww), var(--phh)) translate3d(0px, 0px, 0px);
  }
  to {
    opacity: var(--o-b);
    transform: translate(var(--tx1-b-x), var(--tx1-b-y)) scale(var(--s-b)) translate(var(--pww), var(--phh)) translate3d(0px, 0px, 0px);
  }
}
`

function Assets() {
  return (
    <svg id="ui-svg-defs">
      <defs>
        <RenderMapAssetsDefault />
      </defs>
    </svg>
  )
}
