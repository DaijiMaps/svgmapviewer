import { useCallback, useEffect, useState } from 'react'
import { BoxBox as Box, boxEq, boxUnit } from './box/prefixed'

export function getBodySize(): Box {
  return {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

export function useWindowResize(cb: (size: Readonly<Box>) => void): Box {
  const [size, setSize] = useState(boxUnit)

  useEffect(() => {
    const tmp = getBodySize()
    if (!boxEq(tmp, size)) {
      console.log('first time!', tmp, size)
      setSize(tmp)
      cb(tmp)
    }
  }, [cb, size])

  const handler = useCallback(() => {
    console.log('resize!')
    const tmp = getBodySize()
    if (!boxEq(tmp, size)) {
      setSize(tmp)
      cb(tmp)
    }
  }, [cb, size])

  useEffect(() => {
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [handler])

  return size
}
