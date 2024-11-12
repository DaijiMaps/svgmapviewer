import { useMemo } from 'react'
import { Box } from './box'
import { configLayout, Layout, makeLayout } from './layout'
import { useWindowResize } from './resize-react'

export function useLayout(origViewBox: Box): Layout {
  const size = useWindowResize()

  const layout: Layout = useMemo(() => {
    const { fontSize } = getComputedStyle(document.body)

    return makeLayout(configLayout(parseFloat(fontSize), origViewBox, size))
  }, [origViewBox, size])

  return layout
}
