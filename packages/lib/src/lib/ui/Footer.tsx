/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'

import { svgMapViewerConfig } from '../../config'
import {
  flex_column_center_center,
  position_absolute_left_0_bottom_0,
  timing_closing,
  timing_opening,
  user_select_none,
  ZOOM_DURATION_HEADER,
} from '../css'
import { useShadowRoot } from '../dom'
import type { OpenClose } from './openclose'
import { uiRegisterHeaderCb } from './ui-react'

export function Footer(): ReactNode {
  useShadowRoot('footer', <FooterRoot />, 'ui')

  return <div id="footer" />
}

function FooterRoot(): ReactNode {
  const config = svgMapViewerConfig

  return (
    <div
      className="ui-content footer"
      ref={uiRegisterHeaderCb('footer', openCloseFooterRef)}
    >
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
  will-change: opacity, transform;
  transform-origin: 50% 100%;
  transform: translate(calc(50vw - 50%), 0%) scale(1);
}

@keyframes xxx-footer {
  from {
    opacity: var(--footer-a);
    transform: translate(calc(50vw - 50%), 0%) scale(var(--footer-a)) translate3d(0px, 0px, 0px);
  }
  to {
    opacity: var(--footer-b);
    transform: translate(calc(50vw - 50%), 0%) scale(var(--footer-b)) translate3d(0px, 0px, 0px);
  }
}
`

function openCloseFooter(
  // eslint-disable-next-line functional/prefer-immutable-types
  node: HTMLDivElement,
  { open, animating }: Readonly<OpenClose>
  // eslint-disable-next-line functional/no-return-void
): void {
  const s = node.style.setProperty
  const r = node.style.removeProperty
  // eslint-disable-next-line functional/no-conditional-statements
  if (!animating) {
    const b = !open ? 0 : 1
    r('--footer-a')
    s('--footer-b', `${b}`)
    r('--footer-duration')
    r('--footer-timing')
    s('opacity', `var(--footer-b)`)
    s('transform', `translate(calc(50vw - 50%), 0%) scale(var(--footer-b))`)
    r('animation')
    // eslint-disable-next-line functional/no-conditional-statements
  } else {
    const [a, b] = !open ? [1, 0] : [0, 1]
    const t = open ? timing_opening : timing_closing
    s('--footer-a', `${a}`)
    s('--footer-b', `${b}`)
    s('--footer-duration', `${ZOOM_DURATION_HEADER}ms`)
    s('--footer-timing', `${t}`)
    r('opacity')
    r('transform')
    s('animation', `xxx-footer var(--footer-duration) var(--footer-timing)`)
  }
}

export function openCloseFooterRef(
  // eslint-disable-next-line functional/prefer-immutable-types
  node: HTMLDivElement
) {
  // eslint-disable-next-line functional/no-return-void
  return function (oc: OpenClose): void {
    return openCloseFooter(node, oc)
  }
}
