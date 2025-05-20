import { useSelector } from '@xstate/react'
import { Debug } from './Debug'
import { Detail } from './Detail'
import { Footer } from './Footer'
import { Header } from './Header'
import { searchRef } from './lib/search'
import { selectDetail, uiActor } from './lib/ui-xstate'
import { Right } from './Right'
import { Shadow } from './Shadow'

// XXX group UI part animations into one
// XXX receive animationend here (.ui)

export function Ui() {
  // XXX
  // XXX
  // XXX
  // XXX - hide Detail as it uses layout
  // XXX - ideally detail/balloon draws shapes only via css
  // XXX - then Detail can be unconditionally rendered
  // XXX
  // XXX
  // XXX
  const detail = useSelector(uiActor, selectDetail)

  return (
    <div id="ui">
      <Shadow />
      {detail !== null && <Detail />}
      <Header />
      <Footer />
      <Right />
      <Debug _searchRef={searchRef} />
    </div>
  )
}
