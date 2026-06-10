/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-throw-statements */
import { StrictMode, useEffect, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'

import { notifyGlobal } from '../event-global'
import { useRendered } from './style-react'

//import { timing_opening } from '../css'
//import { notifyGlobal } from '../event-global'
//import { useAppearing, useRendered, useShown } from './style-react'

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

  return <></>
}
