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

// XXX group UI part animations into one
// XXX receive animationend here (.ui)

export function UiRoot(): ReactNode {
  useShadowRoot(UI_ROOT_ID, <Ui />)

  return <div id={UI_ROOT_ID} />
}

export function Ui(): ReactNode {
  return (
    <>
      <UiContent />
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
      <style>{style}</style>
    </div>
  )
}

const style = `
.detail-balloon {
  contain: initial;
}

.balloon,
.detail {
  contain: content;
}

.detail,
.balloon,
.balloon-container {
  box-sizing: border-box;
}

.right,
.header,
.footer {
  box-sizing: border-box;
}

h1, h2, h3, h4, h5, h6 {
  font-family: sans-serif;
  font-weight: lighter;
  text-align: center;
}

svg {
  display: block;
}

ul {
  list-style: none;
}

a:link {
  text-decoration: none;
}

#ui-svg-defs {
  display: none;
}
`
