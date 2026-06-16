/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { useRef, type ReactNode } from 'react'

import { useConfig } from '../../config'
import {
  flex_column_center_center,
  position_absolute_left_0_bottom_0,
  timing_closing,
  timing_opening,
  user_select_none,
  ZOOM_DURATION_HEADER,
} from '../css'
import { useShadowRoot } from '../dom'
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
      <p>
        <a href={document.location.href + `?info=1`} target="_blank">
          {cfg.copyright}
        </a>
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
  transform-origin: 50% 100%;
  &.not-animating {
    opacity: var(--b);
    transform: translate(calc(50vw - 50%), 0%) scale(var(--b));
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
`
