/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { AppCss } from './AppStyle'
import { BalloonCss } from './BalloonStyle'
import { Detail } from './Detail'
import { DetailCss } from './DetailStyle'
import { Footer } from './Footer'
import { FooterCss } from './FooterStyle'
import { Guides } from './Guides'
import { GuidesCss } from './GuidesStyle'
import { Header } from './Header'
import { HeaderCss } from './HeaderStyle'
import { Right } from './Right'
import { RightCss } from './RightStyle'
import { Shadow } from './Shadow'
import { ShadowCss } from './ShadowStyle'
import { UiStyle as StyleUiStyle } from './Style'
import { UiCss } from './UiStyle'
import { useUiRendered } from './lib/ui-react'

// XXX group UI part animations into one
// XXX receive animationend here (.ui)

export function Ui(): ReactNode {
  // eslint-disable-next-line functional/no-expression-statements
  useUiRendered()

  return (
    <>
      <UiContent />
      <UiStyle />
    </>
  )
}

function UiContent(): ReactNode {
  return (
    <div id="ui">
      <Shadow />
      <Guides />
      <Detail />
      <Header />
      <Footer />
      <Right />
    </div>
  )
}

function UiStyle(): ReactNode {
  return (
    <>
      <AppCss />
      <GuidesCss />
      <BalloonCss />
      <DetailCss />
      <FooterCss />
      <HeaderCss />
      <RightCss />
      <ShadowCss />
      <UiCss />
      <StyleUiStyle />
    </>
  )
}
