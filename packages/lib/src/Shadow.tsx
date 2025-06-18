/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { notifyUiClose } from './lib/config-xstate'
import {
  position_absolute_left_0_top_0,
  timing_closing,
  timing_opening,
  width_100vw_height_100svh,
  Z_INDEX_SHADOW,
  ZOOM_DURATION_DETAIL,
} from './lib/css'
import { useShadowRoot } from './lib/dom'
import { useAnimating } from './lib/style-xstate'
import { useOpenCloseDetail } from './lib/ui-xstate'
import { wheeleventmask } from './lib/viewer-xstate'

export function Shadow(): ReactNode {
  useShadowRoot('shadow', <ShadowContent />, 'ui')

  return <div id="shadow" />
}

function ShadowContent(): ReactNode {
  const ref = useRef<HTMLDivElement>(null)

  useOnWheel(ref)

  return (
    <div
      ref={ref}
      className="ui-content shadow"
      // eslint-disable-next-line functional/no-return-void
      onClick={() => notifyUiClose()}
    >
      <style>
        {style}
        <ShadowStyle />
      </style>
    </div>
  )
}

const style = `
.shadow {
  ${position_absolute_left_0_top_0}
  ${width_100vw_height_100svh}
  background-color: black;
  cursor: default;
  pointer-events: initial;
  z-index: ${Z_INDEX_SHADOW};
  will-change: opacity;
}
`

export function ShadowStyle(): ReactNode {
  const { open, animating } = useOpenCloseDetail()
  const zooming = useAnimating()

  if (!animating) {
    return !open ? (
      !zooming ? (
        <>{`.shadow { display: none; }`}</>
      ) : (
        // protect scroll during zoom animation
        // (changing overflow of viewer is expensive)
        <>{`.shadow { display: initial; opacity: 0; } `}</>
      )
    ) : (
      <>
        {`
.shadow {
  opacity: 0.3;
  will-change: opacity;
}
`}
      </>
    )
  } else {
    const [a, b] = !open ? [0.3, 0] : [0, 0.3]
    const t = open ? timing_opening : timing_closing

    return (
      <>
        {`
.shadow {
  --duration: ${ZOOM_DURATION_DETAIL}ms;
  --timing: ${t};
  --a: ${a};
  --b: ${b};
  pointer-events: none;
  will-change: opacity;
  animation: xxx-shadow var(--duration) var(--timing);
}

@keyframes xxx-shadow {
  from {
    opacity: var(--a);
  }
  to {
    opacity: var(--b);
  }
}
`}
      </>
    )
  }
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
  const t = ev.target
  if (
    wheeleventmask &&
    t instanceof HTMLDivElement &&
    t.scrollWidth === t.clientWidth &&
    t.scrollHeight === t.clientHeight
  ) {
    ev.preventDefault()
  }
}
