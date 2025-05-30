import { type ReactNode } from 'react'
import { Detail } from './Detail'
import { Footer } from './Footer'
import { Guides } from './Guides'
import { Header } from './Header'
import { Right } from './Right'
import { Shadow } from './Shadow'
import './Ui.css'

// XXX group UI part animations into one
// XXX receive animationend here (.ui)

export function Ui(): ReactNode {
  return (
    <div id="ui-root">
      <div id="ui">
        <Shadow />
        <Guides />
        <Detail />
        <Header />
        <Footer />
        <Right />
      </div>
    </div>
  )
}
