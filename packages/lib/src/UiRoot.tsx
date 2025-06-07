/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { useEffect, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { Ui } from './Ui'
import { UI_ROOT_ID } from './lib/ui-react'

export function UiRoot(): ReactNode {
  useUiRoot()

  return <div id={UI_ROOT_ID} />
}

function useUiRoot(): void {
  useEffect(() => {
    const root = document.querySelector(`#${UI_ROOT_ID}`)
    if (root === null || root.shadowRoot !== null) {
      return
    }
    const shadowRoot = root.attachShadow({ mode: 'open' })
    createRoot(shadowRoot).render(<Ui />)
  }, [])
}
