/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
import { useEffect, type ReactNode } from 'react'
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
import { RenderMapAssetsDefault } from './lib/carto/assets'
import { renderShadowRoot } from './lib/dom'
import { UI_ROOT_ID, useUiRendered } from './lib/ui-react'

// XXX group UI part animations into one
// XXX receive animationend here (.ui)

export function UiRoot(): ReactNode {
  // eslint-disable-next-line functional/no-return-void
  useEffect(() => renderShadowRoot(UI_ROOT_ID, <Ui />), [])

  return <div id={UI_ROOT_ID} />
}

export function Ui(): ReactNode {
  useUiRendered()

  return (
    <>
      <UiContent />
      <UiStyle />
      <Assets />
    </>
  )
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

function UiStyle(): ReactNode {
  return (
    <>
      <AppCss />
      <UiCss />
      <ShadowCss />
      <HeaderCss />
      <FooterCss />
      <RightCss />
      <GuidesCss />
      <BalloonCss />
      <DetailCss />
      <StyleUiStyle />
    </>
  )
}

function Assets(): ReactNode {
  return (
    <svg>
      <defs>
        <RenderMapAssetsDefault />
      </defs>
    </svg>
  )
}
