/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { Balloon, BalloonStyle } from './Balloon'
import { svgMapViewerConfig as cfg } from './lib/config'
import { diag } from './lib/diag'
import { isDetailEmpty, uiSend, useDetail } from './lib/ui-xstate'

export function Detail(): ReactNode {
  const detail = useDetail()

  const p = detail.p
  const layout = detail.layout

  const dir = diag(detail.layout.container, p)

  const W = layout.container.width
  const H = layout.container.height

  return (
    <div className="detail-balloon">
      <Balloon _detail={detail} _p={p} _dir={dir} _W={W} _H={H}></Balloon>
      <div
        className="detail"
        // eslint-disable-next-line functional/no-return-void
        onAnimationEnd={() => uiSend({ type: 'DETAIL.ANIMATION.END' })}
      >
        {cfg.renderInfo &&
          !isDetailEmpty(detail) &&
          cfg.renderInfo({ info: detail.info })}
      </div>
      <style>{`@scope {
${style}
}`}</style>
    </div>
  )
}

const style = `
.content {
  overflow: hidden;
}

.detail {
  width: 50vmin;
  height: 50vmin;
  position: absolute;
  left: 0;
  top: 0;
  padding: 0.5em;
  overflow: scroll;
  pointer-events: initial;
  box-sizing: border-box;
  z-index: 11;
}

.detail > h3,
.detail p {
  user-select: none;
  -webkit-user-select: none;
}

.detail > h3 {
  margin: 1.5em;
  text-align: center;
}

.detail > p {
  margin: 0.5em;
}
`

export function DetailStyle(): ReactNode {
  const detail = useDetail()

  const p = detail.p
  const layout = detail.layout

  const dir = diag(detail.layout.container, p)

  const W = layout.container.width
  const H = layout.container.height

  return <BalloonStyle _detail={detail} _p={p} _dir={dir} _W={W} _H={H} />
}
