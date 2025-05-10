import { useMemo } from 'react'
import { Box } from './box'
import { configLayout, Layout, makeLayout } from './layout'
import { useWindowResize } from './resize-react'

export function useLayout(
  cb: (layout: Readonly<Layout>) => void,
  origViewBox: Box
): Layout {
  const size = useWindowResize((size: Readonly<Box>) => {
    const { fontSize } = getComputedStyle(document.body)

    const layout = makeLayout(
      configLayout(parseFloat(fontSize), origViewBox, size)
    )

    cb(layout)
  })

  const layout: Layout = useMemo(() => {
    const { fontSize } = getComputedStyle(document.body)

    return makeLayout(configLayout(parseFloat(fontSize), origViewBox, size))
  }, [origViewBox, size])

  return layout
}
