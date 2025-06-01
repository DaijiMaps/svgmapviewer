import { Fragment, type ReactNode } from 'react'
import { assign, createActor, emit, setup } from 'xstate'
import './Guides.css'
import { scrollCbs } from './lib/scroll'
import { styleSend, useDistanceRadius, useLayout } from './lib/style-xstate'
import { useOpenCloseBalloon } from './lib/ui-xstate'
import type { VecVec } from './lib/vec/prefixed'

export function Guides(): ReactNode {
  return (
    <svg className="guides">
      <Measure />
    </svg>
  )
}

function Measure(): ReactNode {
  return (
    <>
      <g className="measure">
        <MeasurePathUse />
      </g>
      <g className="distance">
        <text id={`distance-origin`}>0m</text>
        {INDEXES.map((i) => (
          <Fragment key={i}>
            <text id={`distance-x-${i + 1}`}>{(i + 1) * 10 + `m`}</text>
            <text id={`distance-y-${i + 1}`}>{(i + 1) * 10 + `m`}</text>
          </Fragment>
        ))}
      </g>
      <g className="coordinate">
        <text id="longitude">E 135.123456</text>
        <text id="latitude">N 35.123456</text>
      </g>
    </>
  )
}

function MeasurePathUse() {
  return (
    <>
      <use href="#measure-horizontal" />
      <use href="#measure-vertical" />
      <use href="#measure-rings" />
    </>
  )
}

export function MeasurePath(): ReactNode {
  const {
    container: { width, height },
  } = useLayout()
  const { client } = useDistanceRadius()

  const horizontal = `M0,${height / 2} h${width}`
  const vertical = `M${width / 2},0 v${height}`
  const rings = INDEXES.map((i) => {
    const r = client * (i + 1)
    return ringPath({ width, height, r })
  }).join(' ')

  // XXX use
  return (
    <>
      <path
        id="measure-horizontal"
        stroke="black"
        strokeWidth="0.15px"
        fill="none"
        d={horizontal}
      />
      <path
        id="measure-vertical"
        stroke="black"
        strokeWidth="0.15px"
        fill="none"
        d={vertical}
      />
      <path
        id="measure-rings"
        stroke="black"
        strokeWidth="0.15px"
        fill="none"
        d={rings}
      />
    </>
  )
}

export function ringPath({
  width,
  height,
  r,
}: {
  width: number
  height: number
  r: number
}): string {
  return `M${width / 2},${height / 2} m-${r},0 a${r},${r} 0,1,0 ${r * 2},0 a${r},${r} 0,1,0 -${r * 2},0`.replaceAll(
    /([.]\d)\d*/g,
    '$1'
  )
}

export function MeasureStyle(): ReactNode {
  const {
    container: { width, height },
  } = useLayout()
  const { client } = useDistanceRadius()
  const { open, animating } = useOpenCloseBalloon()

  const pathStyle = `
`

  // balloon is not open => guide is shown (== opacity: 1)
  const [oa, ob] = !open ? [0, 1] : [1, 0]
  const t = !open
    ? 'cubic-bezier(0.25, 0.25, 0.25, 1)'
    : 'cubic-bezier(0.75, 0, 0.75, 0.75)'

  const animationStyle = !animating
    ? `
#measure {
  opacity: ${ob};
  will-change: opacity;
}
`
    : `
#measure {
  animation: xxx-measure 300ms ${t};
  will-change: opacity;
}

@keyframes xxx-measure {
  from {
    opacity: ${oa};
  }
  to {
    opacity: ${ob};
  }
}
`

  const longitudeStyle = `
#longitude {
  transform: translate(${width / 2 + 2}px, ${height / 2 - 2}px) scale(0.5);
  font-size: medium;
  font-weight: lighter;
  text-anchor: start;
}
`
  const latitudeStyle = `
#latitude {
  transform: translate(${width / 2 - 2}px, ${height / 2 - 2}px) scale(0.5);
  font-size: medium;
  font-weight: lighter;
  text-anchor: end;
}
`

  const distanceOriginStyle = `
#distance-origin {
  transform: translate(${width / 2 + 2}px, ${height / 2 + 8}px) scale(0.5);
  font-size: medium;
  font-weight: lighter;
  text-anchor: start;
}
`
  const distanceXStyle = INDEXES.map((i) => {
    const r = client * (i + 1)
    return `
#distance-x-${i + 1} {
  transform: translate(${width / 2 + 2 + r}px, ${height / 2 + 8}px) scale(0.5);
  font-size: medium;
  font-weight: lighter;
  text-anchor: start;
}
`
  })

  const distanceYStyle = INDEXES.map((i) => {
    const r = client * (i + 1)
    return `
#distance-y-${i + 1} {
  transform: translate(${width / 2 + 2}px, ${height / 2 + 8 + r}px) scale(0.5);
  font-size: medium;
  font-weight: lighter;
  text-anchor: start;
}
`
  })

  return (
    <>
      {pathStyle}
      {animationStyle}
      {longitudeStyle}
      {latitudeStyle}
      {distanceOriginStyle}
      {distanceXStyle}
      {distanceYStyle}
    </>
  )
}

// XXX
// XXX
// XXX
const INDEXES = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
]
// XXX
// XXX
// XXX

type EV = React.UIEvent<HTMLDivElement, Event>

type Call = {
  p: VecVec
  timeStamp: number
}

type Events = { type: 'TICK'; ev: EV }
type Emitted = { type: 'CALL'; p: null | VecVec }
type Context = {
  lastTicked: null | Call
  lastCalled: null | Call
}

const throttleMachine = setup({
  types: {
    events: {} as Events,
    emitted: {} as Emitted,
    context: {} as Context,
  },
  actions: {
    call: emit(
      (_, args: null | Call): Emitted => ({
        type: 'CALL',
        p: args === null ? null : args.p,
      })
    ),
  },
}).createMachine({
  id: 'throttle1',
  context: {
    lastTicked: null,
    lastCalled: null,
  },
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        TICK: {
          actions: [
            { type: 'call', params: ({ event: { ev } }) => evToCall(ev) },
            assign({
              lastTicked: null,
              lastCalled: ({ event: { ev } }) => evToCall(ev),
            }),
          ],
          target: 'Empty',
        },
      },
    },
    Empty: {
      after: {
        500: {
          actions: assign({
            lastTicked: null,
            lastCalled: null,
          }),
          target: 'Idle',
        },
      },
      on: {
        TICK: [
          {
            guard: ({ context }) => context.lastTicked === null,
            actions: assign({
              lastTicked: ({ event: { ev } }) => evToCall(ev),
            }),
            target: 'Active',
          },
        ],
      },
    },
    Active: {
      after: {
        500: {
          target: 'Expired',
        },
      },
      on: {
        TICK: [
          // XXX
          // XXX emit call at least once in 500ms
          // XXX
          {
            guard: ({ context, event }) =>
              context.lastCalled !== null &&
              event.ev.timeStamp - context.lastCalled.timeStamp > 500,
            actions: [
              { type: 'call', params: ({ event: { ev } }) => evToCall(ev) },
              assign({
                lastTicked: null,
                lastCalled: null,
              }),
            ],
            target: 'Idle',
          },
          {
            actions: assign({
              lastTicked: ({ event: { ev } }) => evToCall(ev),
            }),
            target: 'Restarting',
          },
        ],
      },
    },
    Restarting: {
      always: 'Active',
    },
    // XXX
    // XXX expire & emit call when 500ms passes since the last tick
    // XXX
    Expired: {
      always: [
        {
          actions: [
            // XXX
            // XXX
            // XXX
            // XXX getCurrentScroll
            // XXX
            // XXX
            // XXX
            {
              type: 'call',
              params: ({ context }) => context.lastTicked,
            },
            assign({
              lastTicked: null,
              lastCalled: null,
            }),
          ],
          target: 'Idle',
        },
      ],
    },
  },
})

function evToCall(ev: EV): { p: VecVec; timeStamp: number } {
  return {
    p: {
      x: ev.currentTarget.scrollLeft + ev.currentTarget.clientWidth / 2,
      y: ev.currentTarget.scrollTop + ev.currentTarget.clientHeight / 2,
    },
    timeStamp: ev.timeStamp,
  }
}

const throttleActor = createActor(throttleMachine, {
  //inspect: (iev) => console.log(iev),
})

throttleActor.start()

throttleActor.on('CALL', ({ p }) => {
  if (p === null) {
    return
  }
  styleSend({ type: 'STYLE.LONLAT', p })
})

function updateGeo(ev: EV): void {
  throttleActor.send({ type: 'TICK', ev })
}

scrollCbs.add(updateGeo)
