/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-throw-statements */
import { StrictMode, useEffect, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'

import { timing_opening } from '../css'
import { notifyGlobal } from '../event-global'
import { useAppearing, useRendered, useShown } from './style-react'

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
    requestAnimationFrame(() => notifyGlobal.rendered())
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
`

  return (
    <style>
      {shown_style}
      {appearing_style}
    </style>
  )
}
