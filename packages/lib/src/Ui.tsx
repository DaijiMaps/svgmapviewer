import { Detail } from './Detail'
import { Footer } from './Footer'
import { Header } from './Header'
import { Right } from './Right'
import { Shadow } from './Shadow'

// XXX group UI part animations into one
// XXX receive animationend here (.ui)

export function Ui() {
  return (
    <div id="ui-root">
      <div id="ui">
        <Shadow />
        <Detail />
        <Header />
        <Footer />
        <Right />
      </div>
    </div>
  )
}
