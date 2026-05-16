/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { useRef, type ReactNode } from 'react'

import { svgMapViewerConfig as config } from '../../config'
import {
  flex_column_center_center,
  position_absolute_left_0_bottom_0,
  timing_closing,
  timing_opening,
  user_select_none,
  ZOOM_DURATION_HEADER,
} from '../css'
import { useShadowRoot } from '../dom'
import { useOpenCloseHeaderStyle } from './ui-react'

export function Footer(): ReactNode {
  useShadowRoot('footer', <FooterRoot />, 'ui')

  return <div id="footer" />
}

function FooterRoot(): ReactNode {
  const ref = useRef<HTMLDivElement>(null)

  useOpenCloseHeaderStyle(ref)

  return (
    <div ref={ref} className="ui-content footer">
      <p>
        <a href={document.location.href + `?info=1`} target="_blank">
          {config.copyright}
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
  will-change: initial;
  transform-origin: 50% 100%;
  
  &.opened {
    --opened: 1;
  }
  &.closed {
    --closed: 1;
  }
  &.not-animating {
    --animating: 0;
    --a: initial;
    &.opened {
      --b: 1;
    }
    &.closed {
      --b: 0;
    }
    --duration: initial;
    --timing: initial;
    will-change: initial;
    animation: initial;
    opacity: var(--b);
    transform: translate(calc(50vw - 50%), 0%) scale(var(--b));
  }
  &.animating {
    --animating: 1;
    &.opened {
      --a: 0;
      --b: 1;
      --timing: ${timing_opening};
    }
    &.closed {
      --a: 1;
      --b: 0;
      --timing: ${timing_closing};
    }
    --duration: ${ZOOM_DURATION_HEADER}ms;
    will-change: opacity, transform;
    animation: xxx-footer var(--duration) var(--timing);
    opacity: initial;
    transform: initial;
  }
}

@keyframes xxx-footer {
  from {
    opacity: var(--a);
    transform: translate(calc(50vw - 50%), 0%) scale(var(--a)) translate3d(0px, 0px, 0px);
  }
  to {
    opacity: var(--b);
    transform: translate(calc(50vw - 50%), 0%) scale(var(--b)) translate3d(0px, 0px, 0px);
  }
}
`
