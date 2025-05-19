import { Debug } from './Debug'
import { Detail } from './Detail'
import { Footer } from './Footer'
import { Header } from './Header'
import { searchRef } from './lib/search'
import { useUi } from './lib/ui-react'
import { Right } from './Right'
import { Shadow } from './Shadow'

export function Ui() {
  const { uiRef } = useUi()

  return (
    <>
      <Shadow _uiRef={uiRef} />
      <Detail _uiRef={uiRef} />
      <Header _uiRef={uiRef} />
      <Footer _uiRef={uiRef} />
      <Right _uiRef={uiRef} />
      <Debug _uiRef={uiRef} _searchRef={searchRef} />
    </>
  )
}
