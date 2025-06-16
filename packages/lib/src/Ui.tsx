/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
import { type ReactNode } from 'react'
import { Detail } from './Detail'
import { Footer } from './Footer'
import { Guides } from './Guides'
import { Header } from './Header'
import { useShadowRoot } from './lib/dom'
import { UI_ROOT_ID } from './lib/ui-react'
import { Right } from './Right'
import { Shadow } from './Shadow'

export function Ui(): ReactNode {
  useShadowRoot(UI_ROOT_ID, <UiContent />)

  return <div id={UI_ROOT_ID} />
}

function UiContent(): ReactNode {
  return (
    <div className="ui">
      <Shadow />
      <Header />
      <Footer />
      <Right />
      <Guides />
      <Detail />
    </div>
  )
}
