/* eslint-disable functional/no-return-void */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
import { useEffect } from 'react'

export function SvgMapViewer() {
  useEffect(() => {
    import('../apps/main').then((appsMain) => appsMain.main())
  }, [])

  return (
    <>
      <div id="root"></div>
      <div id="style-root"></div>
    </>
  )
}
