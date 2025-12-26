import { createAtom } from '@xstate/store'
import { useAtom } from '@xstate/store/react'
import { useCallback, useEffect } from 'react'
import { svgMapViewerConfig } from '../../config'
import { floor_switch_duration } from '../css'
import { notifyFloorLock, notifyFloorSelectDone } from '../event-floor'
import type {
  FidxToOnAnimationEnd,
  FidxToOnClick,
  FloorsContext,
} from './floors-types'
import { useFloorsContext } from './floors-xstate'

export function useFloors(): FloorsContext & {
  style: null | string
  fidxToOnAnimationEnd: FidxToOnAnimationEnd
  fidxToOnClick: FidxToOnClick
} {
  const { fidx, prevFidx, images, nimages } = useFloorsContext(
    ({ fidx, prevFidx, images, nimages }) => ({
      fidx,
      prevFidx,
      images,
      nimages,
    })
  )

  const style = makeStyle(fidx, prevFidx)

  // XXX receive only one (appearing) animationend event
  const fidxToOnAnimationEnd: FidxToOnAnimationEnd = useCallback(
    (idx: number) =>
      idx === fidx ? () => notifyFloorSelectDone(idx) : undefined,
    [fidx]
  )

  const fidxToOnClick: FidxToOnClick = useCallback(
    (idx: number) =>
      prevFidx !== null || idx === fidx
        ? undefined
        : () => notifyFloorLock(idx),
    [fidx, prevFidx]
  )

  return {
    fidx,
    prevFidx,
    images,
    nimages,
    style,
    fidxToOnAnimationEnd,
    fidxToOnClick,
  }
}

function makeStyle(fidx: number, prevFidx: null | number): null | string {
  const floorsConfig = svgMapViewerConfig.floorsConfig
  if (floorsConfig === undefined) {
    return null
  }
  const style = floorsConfig.floors
    .map((_, idx) =>
      idx === fidx || idx === prevFidx
        ? ``
        : `
.fidx-${idx} {
  visibility: hidden;
}
`
    )
    .join('')
  const animation =
    prevFidx === null
      ? ``
      : `
.fidx-${prevFidx} {
  will-change: opacity;
  animation: xxx-disappearing ${floor_switch_duration} linear;
}
.fidx-${fidx} {
  will-change: opacity;
  animation: xxx-appearing ${floor_switch_duration} linear;
}
@keyframes xxx-disappearing {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes xxx-appearing {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
`
  return `
${style}
${animation}
`
}

////

function useFloorsImage(idx: number): { blob?: Blob; count: number } {
  return useFloorsContext((context) => ({
    blob: context.images.get(idx),
    count: context.nimages,
  }))
}

////

const imageUrlAtom = createAtom({ images: new Map<number, string>() })

function useImageUrl(idx: number) {
  return useAtom(imageUrlAtom, (s) => s.images.get(idx))
}

function createImageUrl(idx: number, blob?: Blob, url?: string) {
  if (blob === undefined) {
    return
  }
  if (url !== undefined) {
    return
  }
  const objurl = URL.createObjectURL(blob)
  imageUrlAtom.set(({ images }) => {
    images.set(idx, objurl)
    return { images: new Map(images) }
  })
}

function destroyImageUrl(idx: number, url?: string) {
  if (url !== undefined) {
    URL.revokeObjectURL(url)
    imageUrlAtom.set(({ images }) => {
      images.delete(idx)
      return { images: new Map(images) }
    })
  }
}

////

export function useImage(idx: number): undefined | string {
  const { blob } = useFloorsImage(idx)

  const url = useImageUrl(idx)

  useEffect(() => {
    createImageUrl(idx, blob, url)
    return () => destroyImageUrl(idx, url)
  }, [blob, idx, url])

  return url
}
