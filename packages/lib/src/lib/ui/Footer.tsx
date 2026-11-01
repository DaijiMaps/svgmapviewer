import { useAtom } from '@xstate/store-react'
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { useRef, type ReactNode } from 'react'

import { useConfig } from '../../config'
import { debugStringAtom } from '../../debug'
import { openInfo } from '../../mode'
import {
  flex_column_center_center,
  position_absolute_left_0_bottom_0,
  timing_closing,
  timing_opening,
  user_select_none,
  ZOOM_DURATION_HEADER,
} from '../css'
import { useShadowRoot } from '../dom'
import { useStyleValue } from '../style/style-xstate'
import { useScrollValue } from '../viewer/scroll/scroll-xstate'
import {
  useTouchIsScrolling,
  useTouchValue,
} from '../viewer/touch/touch-xstate'
import { viewerMode } from '../viewer/viewer-mode'
import { useViewerValue } from '../viewer/viewer-xstate'
import { useHeaderStyleRef } from './style'

export function Footer(): ReactNode {
  useShadowRoot('footer', <FooterRoot />, 'ui')

  return <div id="footer" />
}

function FooterRoot(): ReactNode {
  const ref = useRef<HTMLDivElement>(null)

  useHeaderStyleRef(ref, 'footer')

  const cfg = useConfig()

  return (
    <div ref={ref} className="ui-content footer">
      {/*
      <Debug />
      */}
      <p>
        <a onClick={() => openInfo()}>{cfg.copyright}</a>
      </p>
      <style>{style}</style>
    </div>
  )
}

const style = `
.footer {
  ${position_absolute_left_0_bottom_0}
  ${flex_column_center_center}
  padding: 0.4em;
  font-size: xx-small;
  pointer-events: none;
  & > h2,
  & > p {
    ${user_select_none}
    pointer-events: initial;
  }
  & > h2 {
    font-size: x-small;
    margin: 0;
  }
  & > p {
    margin: 0.25em;
    & > a {
      color: black;
      &:link, &:visited, &:hover, &:active {
        color: black;
      }
    }
  }
}
.footer {
  --b: 1;
  transform-origin: 50% 100%;
  transform: translate(calc(50vw - 50%), 0%) scale(var(--b));
  opacity: var(--b);
  &.not-animating {
    &.closed {
      --b: 0;
    }
    &.opened {
      --b: 1;
    }
    will-change: initial;
    animation: initial;
  }
  &.animating {
    &.closed {
      --a: 1;
      --b: 0;
      --timing: ${timing_closing};
    }
    &.opened {
      --a: 0;
      --b: 1;
      --timing: ${timing_opening};
    }
    --duration: ${ZOOM_DURATION_HEADER}ms;
    will-change: opacity, transform;
    animation: xxx-footer var(--duration) var(--timing);
  }
}
@keyframes xxx-footer {
  from {
    opacity: var(--a);
    transform: translate(calc(50vw - 50%), 0%) scale(var(--a));
  }
  to {
    opacity: var(--b);
    transform: translate(calc(50vw - 50%), 0%) scale(var(--b));
  }
}
.debug {
  display: flex;
  flex-direction: column-reverse;
  font-size: x-small;
  pointer-events: none;
  & > p {
    margin: 0;
  }
}
`

export function Debug(): ReactNode {
  const debugStrings = useAtom(debugStringAtom)

  const v = useViewerValue()
  const t = useTouchValue()
  const y = useStyleValue()
  const m = useAtom(viewerMode)

  const S = useScrollValue()
  const r = useTouchIsScrolling()

  return (
    <>
      <div className="debug">
        {Array.from(debugStrings).map((s, idx) => (
          <p key={idx}>
            {idx}:{s}
          </p>
        ))}
      </div>
      <p>
        {S}:{r ? 'S' : 's'}
      </p>
      <p>
        {v}:{t}:{y}:{m}
      </p>
    </>
  )
}
