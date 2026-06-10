/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
import { useRef, type ReactNode } from 'react'

import { isShadowRootRendered, useShadowRoot } from '../dom'
import { appearing_style, useAppearingStyleRef } from '../style/appearing'
import { DetailBalloon } from './DetailBalloon'
import { Footer } from './Footer'
import { Guides } from './Guides'
import { Header } from './Header'
import { Left } from './Left'
import { Right } from './Right'
import { Screen } from './Screen'
import { UI_ROOT_ID } from './ui-react'

export function Ui(): ReactNode {
  useShadowRoot(UI_ROOT_ID, <UiContent />)

  return <div id={UI_ROOT_ID} />
}

function UiContent(): ReactNode {
  const ref = useRef<HTMLDivElement>(null)
  useAppearingStyleRef(ref, 'ui')
  return (
    <div ref={ref} className="ui">
      <Screen />
      <Header />
      <Footer />
      <Left />
      <Right />
      <Guides />
      <DetailBalloon />
      <style>{appearing_style}</style>
    </div>
  )
}

export function isUiRendered(): boolean {
  return isShadowRootRendered(UI_ROOT_ID)
}
