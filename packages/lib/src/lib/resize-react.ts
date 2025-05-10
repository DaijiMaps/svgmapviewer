import { useCallback, useEffect, useRef, useState } from 'react'
import { BoxBox as Box, boxEq, boxUnit } from './box/prefixed'

export function getBodySize(): Box {
  return {
    x: 0,
    y: 0,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  }
}

export function useWindowResize(
  cb: (size: Readonly<Box>, force: boolean) => void
): void {
  const sizeRef = useRef(boxUnit)
  const [size, setSize] = useState<Box>(boxUnit)
  const [resized, setResized] = useState<boolean>(false)
  const resizingRef = useRef(false)

  useEffect(() => {
    /* always */
    if (!(resized || !resized)) {
      return
    }
    const tmp = getBodySize()
    if (!boxEq(tmp, sizeRef.current)) {
      sizeRef.current = tmp
      setSize(tmp)
      cb(tmp, resizingRef.current)
      resizingRef.current = false
    }
  }, [cb, resized, size])

  const handler = useCallback(() => {
    // XXX
    // XXX
    // XXX
    requestAnimationFrame(() => {
      setResized(!resized)
      resizingRef.current = true
    })
    // XXX
    // XXX
    // XXX
  }, [resized, setResized])

  useEffect(() => {
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [handler])
}
