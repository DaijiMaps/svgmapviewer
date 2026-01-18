/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
import { createRoot } from 'react-dom/client'

import { App, type AppProps } from './App'

export function main(): void {
  const e = document.getElementById('root')
  if (e === null) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('')
  }
  const props: AppProps = {
    title: 'svgpatheditor',
  }
  createRoot(e).render(App(props))
}

main()
