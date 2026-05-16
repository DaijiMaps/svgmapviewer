/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { useEffect, useRef, type ReactNode, type RefObject } from 'react'

import { svgMapViewerConfig } from '../../config'
import {
  pointer_events_none,
  position_absolute_left_0_top_0,
  timing_closing,
  timing_opening,
  user_select_none,
  width_100vw_height_100svh,
  Z_INDEX_GUIDES,
  ZOOM_DURATION_HEADER,
} from '../css'
import { useShadowRoot } from '../dom'
import { Measure, MeasureCoordinate, MeasureDistance } from './Measure'
import { useOpenCloseHeader } from './ui-react'

export function Guides(): ReactNode {
  useShadowRoot('guides', <GuidesRoot />, 'ui')

  return <div id="guides" />
}

function GuidesRoot(): ReactNode {
  const ref = useStyle()
  const showGuides = svgMapViewerConfig.uiConfig?.showGuides ?? true

  return !showGuides || svgMapViewerConfig.mapCoord.matrix.isIdentity ? (
    <></>
  ) : (
    <div ref={ref} className="ui-content guides">
      <svg className="guides">
        <Measure />
      </svg>
      <MeasureDistance />
      <MeasureCoordinate />
      <style>{style}</style>
    </div>
  )
}

const style = `
.guides {
  ${position_absolute_left_0_top_0}
  ${width_100vw_height_100svh}
  ${pointer_events_none}
  z-index: ${Z_INDEX_GUIDES};
  
  &.not-animating {
    &.opened {
      --ob: 1;
    }
    &.closed {
      --ob: 0;
    }
    opacity: var(--ob);
    will-change: opacity;
  }
  &.animating {
    &.opened {
      --oa: 0;
      --ob: 1;
      --timing: ${timing_opening};
    }
    &.closed {
      --oa: 1;
      --ob: 0;
      --timing: ${timing_closing};
    }
    --duration: ${ZOOM_DURATION_HEADER}ms;
    animation: xxx-measure var(--duration) var(--timing);
    will-change: opacity;
  }
}

text {
  ${user_select_none}
}

@keyframes xxx-measure {
  from {
    opacity: var(--oa);
  }
  to {
    opacity: var(--ob);
  }
}
`

function useStyle(): Readonly<RefObject<HTMLDivElement | null>> {
  const ref = useRef<HTMLDivElement>(null)

  const { open, animating } = useOpenCloseHeader()

  useEffect(() => {
    if (ref.current === null) return
    ref.current.classList.remove(animating ? 'not-animating' : 'animating')
    ref.current.classList.add(!animating ? 'not-animating' : 'animating')
    ref.current.classList.remove(open ? 'closed' : `opened`)
    ref.current.classList.add(!open ? 'closed' : `opened`)
  }, [animating, open, ref])

  return ref
}
