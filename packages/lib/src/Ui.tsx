/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
import { useEffect, type ReactNode } from 'react'
import { Detail } from './Detail'
import { Footer } from './Footer'
import { Guides } from './Guides'
import { Header } from './Header'
import { Right } from './Right'
import { Shadow } from './Shadow'
import { UiStyle as StyleUiStyle } from './Style'
import { RenderMapAssetsDefault } from './lib/carto/assets'
import { renderShadowRoot } from './lib/dom'
import { UI_ROOT_ID } from './lib/ui-react'

// XXX group UI part animations into one
// XXX receive animationend here (.ui)

export function UiRoot(): ReactNode {
  // eslint-disable-next-line functional/no-return-void
  useEffect(() => renderShadowRoot(UI_ROOT_ID, <Ui />), [])

  return <div id={UI_ROOT_ID} />
}

export function Ui(): ReactNode {
  return (
    <>
      <UiContent />
      <UiStyle />
      <Assets />
      <style>{style}</style>
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

const style = `
.ui > * {
  contain: content;
}

.ui > .detail-balloon {
  contain: initial;
}

.balloon,
.detail {
  contain: content;
}

.detail,
.balloon,
.balloon-container,
.container {
  box-sizing: border-box;

  /* XXX */
  touch-action: none;
  /* XXX */
  user-select: none; /* Standard syntax */
}

.right,
.header,
.footer {
  box-sizing: border-box;
}

div {
  transform-origin: 50% 50%;
}

svg {
  display: block;
}

ul {
  list-style: none;
}

h1,
h2,
h3,
h4,
h5 {
  font-family: sans-serif;
  font-weight: lighter;
}

a:link {
  text-decoration: none;
}
`
