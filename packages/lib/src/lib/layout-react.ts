import { Box } from './box'
import { configLayout, Layout, makeLayout } from './layout'
import { useWindowResize } from './resize-react'

export function useLayout(
  cb: (layout: Readonly<Layout>, force: boolean) => void,
  origViewBox: Box
): void {
  useWindowResize(resizeCb(cb, origViewBox))
}

const resizeCb =
  (cb: (layout: Readonly<Layout>, force: boolean) => void, origViewBox: Box) =>
  (size: Readonly<Box>, force: boolean) => {
    const { fontSize } = getComputedStyle(document.body)

    const layout = makeLayout(
      configLayout(parseFloat(fontSize), origViewBox, size)
    )

    cb(layout, force)
  }
