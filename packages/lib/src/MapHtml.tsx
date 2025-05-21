import { useEffect } from 'react'
import { rootActor } from './lib/map-html-xstate'
import { useNames } from './lib/names'
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

//// shadow DOM actor

// XXX - don't have to keep copy of names here
// XXX - store names in configActor
// XXX - listen on names change & re-render

const ROOT_ID = 'map-html-content-root'

// eslint-disable-next-line functional/no-return-void
function useMapHtmlContentRoot() {
  const { pointNames, areaNames } = useNames()

  // eslint-disable-next-line functional/no-expression-statements, functional/no-return-void
  useEffect(() => {
    // eslint-disable-next-line functional/no-expression-statements
    mountMapHtmlContentRoot(ROOT_ID)
  }, [])

  // eslint-disable-next-line functional/no-expression-statements, functional/no-return-void
  useEffect(() => {
    // eslint-disable-next-line functional/no-expression-statements
    rootActor.send({ type: 'UPDATE', pointNames, areaNames })
  }, [pointNames, areaNames])
}

// eslint-disable-next-line functional/no-return-void
function mountMapHtmlContentRoot(id: string) {
  const root = document.querySelector(`#${id}`)
  if (root === null || root.shadowRoot !== null) {
    return
  }
  // shadowRoot is present

  // eslint-disable-next-line functional/no-expression-statements
  rootActor.send({ type: 'MOUNT' })
}
