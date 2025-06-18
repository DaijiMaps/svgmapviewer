/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/functional-parameters */
import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { RenderMapAssetsDefault } from './lib/carto/assets'
import { svgMapViewerConfig as cfg } from './lib/config'
import {
  box_sizing_border_box,
  pointer_events_initial,
  position_absolute_left_0_top_0,
  user_select_none,
  Z_INDEX_DETAIL,
} from './lib/css'
import type { UiDetailContent } from './lib/ui-types'
import { isDetailEmpty, uiSend } from './lib/ui-xstate'
import { wheeleventmask } from './lib/viewer-xstate'

export function Detail(
  props: Readonly<{ _detail: UiDetailContent }>
): ReactNode {
  const { _detail } = props

  const ref = useRef<HTMLDivElement>(null)

  useOnWheel(ref)

  return (
    <div
      ref={ref}
      className="detail"
      onAnimationEnd={() => uiSend({ type: 'DETAIL.ANIMATION.END' })}
    >
      {cfg.renderInfo &&
        !isDetailEmpty(_detail) &&
        cfg.renderInfo({ info: _detail.info })}
      <Assets />
      <style>{style}</style>
    </div>
  )
}

const style = `
.detail {
  ${position_absolute_left_0_top_0}
  width: 50vmin;
  height: 50vmin;
  padding: 0.5em;
  overflow: scroll;
  ${pointer_events_initial}
  ${box_sizing_border_box}
  z-index: ${Z_INDEX_DETAIL};
  will-change: opacity, transform;
  cursor: default;
  touch-action: pan-x pan-y;
  overscroll-behavior: contain;
}

.like {
  pointer-events: initial;
}

.liked {
  color: orange;
}

h1,
h2,
h3,
h4 {
  ${user_select_none}
  margin: 1.5em;
  text-align: center;
  pointer-events: none;
}

p {
  ${user_select_none}
  margin: 0.5em;
  pointer-events: none;
}

table, tbody, th, tr, td {
  pointer-events: none;
}

#ui-svg-defs {
  display: none;
}
`

function Assets(): ReactNode {
  return (
    <svg id="ui-svg-defs">
      <defs>
        <RenderMapAssetsDefault />
      </defs>
    </svg>
  )
}

// XXX
// XXX
// XXX - prevent wheel events from propagating
// XXX - if detail content is short & is NOT scrollable, overscroll-behavior does NOT work
// XXX - we cannot make container unscrollable, because it is VERY expensive
// XXX
// XXX

function useOnWheel(ref: Readonly<RefObject<null | HTMLDivElement>>): void {
  useEffect(() => {
    const e = ref.current
    if (!e) {
      return
    }
    e.addEventListener('wheel', onwheel)
    return () => {
      e.removeEventListener('wheel', onwheel)
    }
  }, [ref])
}

function onwheel(ev: Readonly<WheelEvent | React.WheelEvent>): void {
  const t = ev.currentTarget
  if (
    wheeleventmask &&
    t instanceof HTMLDivElement &&
    t.scrollWidth === t.clientWidth &&
    t.scrollHeight === t.clientHeight
  ) {
    ev.preventDefault()
  }
}
