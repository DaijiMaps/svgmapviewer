/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-throw-statements */
import { StrictMode, useEffect, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'

import { timing_opening } from '../css'
import { notifyGlobal } from '../event-global'
import { trunc2 } from '../utils'
import {
  useAppearing,
  useLayoutConfig,
  useLayoutScroll,
  useLayoutSvgScaleS,
  useRendered,
  useShown,
  useZoom,
} from './style-react'

export function styleRoot(): void {
  const e = document.getElementById('style-root')

  if (e === null) {
    throw new Error('#style-root not found!')
  }

  createRoot(e).render(
    <StrictMode>
      <RootStyle />
    </StrictMode>
  )
}

function RootStyle(): ReactNode {
  const rendered = useRendered()

  useEffect(() => {
    requestAnimationFrame(notifyGlobal.rendered)
  }, [rendered])

  const shown = useShown()
  const shown_style = shown ? '' : `#viewer, #ui { opacity: 0; }`

  const appearing = useAppearing()
  const appearing_style = !appearing
    ? ''
    : `
#viewer, #ui {
  will-change: opacity;
  animation: xxx-appearing 2s ${timing_opening};
}
@keyframes xxx-appearing {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
`
  const scroll = useLayoutScroll()
  const scroll_style = `
.content {
  width: ${trunc2(scroll.width)}px;
  height: ${trunc2(scroll.height)}px;
}
`

  return (
    <style>
      {shown_style}
      {appearing_style}
      {scroll_style}
    </style>
  )
}

export function SvgSymbolStyle(): ReactNode {
  const config = useLayoutConfig()
  const s = useLayoutSvgScaleS()
  const zoom = useZoom()
  const sz =
    config.fontSize *
    // display symbol slightly larger as zoom goes higher
    (0.5 + 0.5 * Math.log2(Math.max(1, zoom))) *
    s

  const style = `
use,
.map-symbols,
.map-markers {
  --map-symbol-size: ${sz / 72};
}
`

  return <>{style}</>
}
