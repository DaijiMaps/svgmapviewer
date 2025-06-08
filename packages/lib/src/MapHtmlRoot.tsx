/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { type ReactNode, useEffect } from 'react'
import { renderShadowRoot } from './lib/dom'
import { MAP_HTML_ROOT_ID } from './lib/map-html-react'
import { MapHtml } from './MapHtml'
import './MapHtml.css'

export function MapHtmlRoot(): ReactNode {
  useEffect(() => renderShadowRoot(MAP_HTML_ROOT_ID, <MapHtml />), [])

  return <div id={MAP_HTML_ROOT_ID} className="content html" />
}
