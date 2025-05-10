import { useCallback, useEffect, useRef, useState } from 'react'
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
  const sizeRef = useRef(boxUnit)
  const [size, setSize] = useState<Box>(boxUnit)
  const [resized, setResized] = useState<boolean>(false)

  useEffect(() => {
    /* always */
    if (!(resized || !resized)) {
      return
    }
    const tmp = getBodySize()
    if (!(boxEq(tmp, sizeRef.current) || boxEq(tmp, size))) {
      sizeRef.current = tmp
      setSize(tmp)
      cb(tmp)
    }
  }, [cb, resized, size])

  const handler = useCallback(() => {
    setResized(!resized)
  }, [resized, setResized])

  useEffect(() => {
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [handler])

  return size
}
