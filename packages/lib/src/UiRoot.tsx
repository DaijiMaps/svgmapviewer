/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { useEffect, type ReactNode } from 'react'
import { Ui } from './Ui'
import { renderShadowRoot } from './lib/dom'
import { UI_ROOT_ID } from './lib/ui-react'

export function UiRoot(): ReactNode {
  useEffect(() => renderShadowRoot(UI_ROOT_ID, <Ui />), [])

  return <div id={UI_ROOT_ID} />
}
