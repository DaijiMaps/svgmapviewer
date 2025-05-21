import { ROOT_ID, useMapHtmlContentRoot } from './lib/map-html-react'
import './MapHtml.css'

export function MapHtml() {
  // eslint-disable-next-line functional/no-expression-statements
  useMapHtmlContentRoot()

  return (
    <div className="content html">
      <div id={ROOT_ID} />
    </div>
  )
}
