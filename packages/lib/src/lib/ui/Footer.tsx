/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { useEffect, useRef, type ReactNode, type RefObject } from 'react'

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
import { useOpenCloseHeader } from './ui-react'

export function Footer(): ReactNode {
  useShadowRoot('footer', <FooterRoot />, 'ui')

  return <div id="footer" />
}

function FooterRoot(): ReactNode {
  const ref = useRef<HTMLDivElement>(null)
  const config = svgMapViewerConfig

  useFooterStyle(ref)

  return (
    <div className="ui-content footer" ref={ref}>
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
  will-change: none;
  transform-origin: 50% 100%;
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

export function useFooterStyle(
  ref: Readonly<RefObject<HTMLDivElement | null>>
): void {
  const { open, animating } = useOpenCloseHeader()

  useEffect(() => {
    if (ref.current === null) return
    const s = ref.current.style.setProperty.bind(ref.current.style)
    const r = ref.current.style.removeProperty.bind(ref.current.style)
    if (!animating) {
      const b = !open ? 0 : 1

      r('--a')
      s('--b', `${b}`)
      r('--duration')
      r('--timing')
      s('will-change', `none`)
      s('animation', `none`)
      s('opacity', `var(--b)`)
      s('transform', `translate(calc(50vw - 50%), 0%) scale(var(--b))`)
    } else {
      const [a, b] = !open ? [1, 0] : [0, 1]
      const t = open ? timing_opening : timing_closing

      s('--a', `${a}`)
      s('--b', `${b}`)
      s('--duration', `${ZOOM_DURATION_HEADER}ms`)
      s('--timing', `${t}`)
      s('will-change', `opacity, transform`)
      s('animation', `xxx-footer var(--duration) var(--timing)`)
    }
  }, [animating, open, ref])
}
