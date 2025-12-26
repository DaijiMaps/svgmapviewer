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

type SetImageParams = { fidx: number; blob: Blob }
type SetImage = { type: 'setImage'; params: SetImageParams }

const floorsMachine = setup({
  types: {
    context: {} as FloorsContext,
    events: {} as FloorsEvents,
    // XXX emitted
  },
  actions: {
    setImage: assign({
      images: ({ context }, { fidx, blob }: SetImageParams) =>
        new Map(context.images.set(fidx, blob)),
    }),
  },
}).createMachine({
  id: 'floors1',
  context: {
    fidx: 0,
    prevFidx: null,
    images: new Map(),
  },
  initial: 'Idle',
  on: {
    IMAGE: {
      actions: ({ event: { fidx, blob } }): SetImage => ({
        type: 'setImage',
        params: { fidx, blob },
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

const floorsActor = createActor(floorsMachine)

export function floorsActorStart(): void {
  floorsActor.start()
}

export function useFloorsContext<T>(f: (ctx: Readonly<FloorsContext>) => T): T {
  return useSelector(floorsActor, (state) => f(state.context))
}

export function useFloorsImage(idx: number): undefined | Blob {
  return useSelector(floorsActor, (state) => state.context.images.get(idx))
}

const imageUrlAtom = createAtom({ images: new Map<number, string>() })

export function useImage(idx: number): undefined | string {
  const blob = useFloorsImage(idx)

  const url = useAtom(imageUrlAtom, (s) => s.images.get(idx))

  console.log('useImage', blob, url)

  useEffect(() => {
    if (blob !== undefined) {
      const objurl = URL.createObjectURL(blob)
      imageUrlAtom.set(({ images }) => {
        images.set(idx, objurl)
        return { images: new Map() }
      })
    }
    return () => {
      if (url !== undefined) {
        URL.revokeObjectURL(url)
        imageUrlAtom.set(({ images }) => {
          images.delete(idx)
          return { images: new Map(images) }
        })
      }
    }
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
      console.log(ev)
      break
    }
    case 'FETCH.DONE': {
      console.log(ev)
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
