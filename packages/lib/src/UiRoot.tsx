import { type ReactNode } from 'react'
import { useUiRoot } from './lib/ui-react'

export function UiRoot(): ReactNode {
  // eslint-disable-next-line functional/no-expression-statements
  useUiRoot()

  return <div id="ui-root" />
}
