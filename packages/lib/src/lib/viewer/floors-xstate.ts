import { useSelector } from '@xstate/react'
import { createAtom } from '@xstate/store'
import { useAtom } from '@xstate/store/react'
import { useEffect } from 'react'
import { assign, createActor, setup } from 'xstate'
import type { SvgMapViewerConfig } from '../../types'
import { floorCbs } from '../event-floor'
import { globalCbs } from '../event-global'
import type { FloorsContext, FloorsEvents } from './floors-types'
import type { Res } from './floors-worker-types'

const floorsMachine = setup({
  types: {
    context: {} as FloorsContext,
    events: {} as FloorsEvents,
    // XXX emitted
  },
}).createMachine({
  id: 'floors1',
  context: {
    fidx: 0,
    prevFidx: null,
    images: new Map(),
    nimages: 0,
  },
  initial: 'Idle',
  on: {
    IMAGE: {
      actions: assign({
        images: ({ context, event: { fidx, blob } }) =>
          new Map(context.images.set(fidx, blob)),
        nimages: ({ context: { nimages } }) => nimages + 1,
      }),
    },
  },
  states: {
    Idle: {
      on: {
        SELECT: [
          {
            guard: ({ event }) => event.force ?? false,
            actions: assign({
              fidx: ({ event }) => event.fidx,
            }),
          },
          {
            guard: ({ context, event }) => context.fidx !== event.fidx,
            actions: assign({
              fidx: ({ event }) => event.fidx,
              prevFidx: ({ context }) => context.fidx,
            }),
            target: 'Animating',
          },
        ],
      },
    },
    Animating: {
      on: {
        // XXX receive one DONE event
        // XXX (receiving two without race is difficult/complex)
        'SELECT.DONE': {
          actions: assign({
            prevFidx: null,
          }),
          target: 'Idle',
        },
      },
    },
  },
})

const floorsActor = createActor(floorsMachine, {
  inspect: console.log,
})

export function floorsActorStart(): void {
  floorsActor.start()
}

export function useFloorsContext<T>(f: (ctx: Readonly<FloorsContext>) => T): T {
  return useSelector(floorsActor, (state) => f(state.context))
}

export function useFloorsImage(idx: number): { blob?: Blob; count: number } {
  return useSelector(floorsActor, (state) => ({
    blob: state.context.images.get(idx),
    count: state.context.nimages,
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

// worker

const worker: Worker = new Worker(
  new URL('./floors-worker.js', import.meta.url),
  {
    type: 'module',
  }
)

worker.onmessage = (e: Readonly<MessageEvent<Res>>): void => {
  const ev = e.data
  // XXX floorsActor.send()
  switch (ev.type) {
    case 'INIT.DONE': {
      break
    }
    case 'FETCH.DONE': {
      floorsActor.send({ type: 'IMAGE', fidx: ev.idx, blob: ev.blob })
      break
    }
  }
}

worker.onerror = (ev) => {
  console.error('floors error', ev)
}

worker.onmessageerror = (ev) => {
  console.error('floors messageerror', ev)
}

// XXX
// floorsActor.on(..., () => {
//   worker.postMessage()
// })

// handlers

export function floorsCbsStart(): void {
  globalCbs.init.add((cfg: Readonly<SvgMapViewerConfig>) => {
    if (cfg.floorsConfig) {
      const fidx = cfg.floorsConfig.fidx
      floorsActor.send({ type: 'SELECT', fidx, force: true })
      worker.postMessage({ type: 'INIT', cfg: cfg.floorsConfig })
    }
  })
  floorCbs.select.add((fidx: number) =>
    floorsActor.send({ type: 'SELECT', fidx })
  )
  floorCbs.selectDone.add((fidx: number) =>
    floorsActor.send({ type: 'SELECT.DONE', fidx })
  )
}
