import { useUiRoot } from './lib/ui-react'

export function UiRoot() {
  // eslint-disable-next-line functional/no-expression-statements
  useUiRoot()

  return <div id="ui-root" />
}
