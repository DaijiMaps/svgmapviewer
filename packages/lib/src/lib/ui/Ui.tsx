/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
import { type ReactNode } from 'react'
import { useShadowRoot } from '../dom'
import { DetailBalloon } from './DetailBalloon'
import { Footer } from './Footer'
import { Guides } from './Guides'
import { Header } from './Header'
import { Right } from './Right'
import { Shadow } from './Shadow'
import { UI_ROOT_ID } from './ui-react'

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
      <DetailBalloon />
    </div>
  )
}
