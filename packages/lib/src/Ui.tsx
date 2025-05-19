import { Debug } from './Debug'
import { Detail } from './Detail'
import { Footer } from './Footer'
import { Header } from './Header'
import { searchRef } from './lib/search'
import { Right } from './Right'
import { Shadow } from './Shadow'

export function Ui() {
  return (
    <div className="ui">
      <Shadow />
      <Detail />
      <Header />
      <Footer />
      <Right />
      <Debug _searchRef={searchRef} />
    </div>
  )
}
