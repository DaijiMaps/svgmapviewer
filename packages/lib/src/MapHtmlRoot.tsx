/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { type ReactNode, useEffect } from 'react'
import { renderShadowRoot } from './lib/dom'
import { ROOT_ID } from './lib/map-html-react'
import { MapHtml } from './MapHtml'
import './MapHtml.css'

export function MapHtmlRoot(): ReactNode {
  useMapHtmlRoot()

  return <div id={ROOT_ID} className="content html" />
}

function useMapHtmlRoot(): void {
  useEffect(() => renderShadowRoot(ROOT_ID, <MapHtml />), [])
}
