import { ROOT_ID, useMapHtmlRoot } from './lib/map-html-react'
import './MapHtml.css'

export function MapHtmlRoot() {
  // eslint-disable-next-line functional/no-expression-statements
  useMapHtmlRoot()

  return (
    <div className="content html">
      <div id={ROOT_ID} />
    </div>
  )
}
