import { Fragment, type ReactNode } from 'react'
import { assign, createActor, emit, setup } from 'xstate'
import './Guides.css'
import { scrollCbs } from './lib/scroll'
import { useLayout } from './lib/style-xstate'
import { useOpenCloseBalloon } from './lib/ui-xstate'

export function Guides(): ReactNode {
  return (
    <svg className="guides">
      <Measure />
    </svg>
  )
}

function Measure(): ReactNode {
  return (
    <g>
      <text id="longitude">E 135.123456</text>
      <text id="latitude">N 35.123456</text>
      <g className="distance">
        <text id={`distance-origin`}>0m</text>
        {INDEXES.map((i) => (
          <Fragment key={i}>
            <text id={`distance-x-${i}`}>{(i + 1) * 10 + `m`}</text>
            <text id={`distance-y-${i}`}>{(i + 1) * 10 + `m`}</text>
          </Fragment>
        ))}
      </g>
      <MeasurePath />
    </g>
  )
}

function MeasurePath() {
  const {
    container: { width, height },
  } = useLayout()

  const horizontal = `M0,${height / 2} h${width}`
  const vertical = `M${width / 2},0 v${height}`
  const rings = INDEXES.map((i) => {
    const r = 100 * (i + 1)
    return `M${width / 2},${height / 2} m-${r},0 a${r},${r} 0,1,0 ${r * 2},0 a${r},${r} 0,1,0 -${r * 2},0`
  }).join(' ')
  // XXX no newlines allowed
  const d = `${horizontal} ${vertical} ${rings}`

  return (
    <path id="measure" stroke="black" strokeWidth="0.15px" fill="none" d={d} />
  )
}

export function MeasureStyle(): ReactNode {
  const {
    container: { width, height },
  } = useLayout()
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
    const r = 100 * (i + 1)
    return `
#distance-x-${i} {
  transform: translate(${width / 2 + 2 + r}px, ${height / 2 + 8}px) scale(0.5);
  font-size: medium;
  font-weight: lighter;
  text-anchor: start;
}
`
  })

  const distanceYStyle = INDEXES.map((i) => {
    const r = 100 * (i + 1)
    return `
#distance-y-${i} {
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

type Events = { type: 'TICK'; ev: EV }
type Emitted = { type: 'CALL'; ev: null | EV }
type Context = {
  lastTicked: null | EV
  lastCalled: null | EV
}

const throttleMachine = setup({
  types: {
    events: {} as Events,
    emitted: {} as Emitted,
    context: {} as Context,
  },
  actions: {
    call: emit(
      (_, { ev }: { ev: null | EV }): Emitted => ({ type: 'CALL', ev })
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
            { type: 'call', params: ({ event: { ev } }) => ({ ev }) },
            assign({
              lastTicked: null,
              lastCalled: ({ event: { ev } }) => ev,
            }),
          ],
          target: 'Active',
        },
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
          {
            guard: ({ context }) => context.lastTicked === null,
            actions: assign({
              lastTicked: ({ event }) => event.ev,
            }),
            target: 'Restarting',
          },
          // XXX
          // XXX emit call at least once in 500ms
          // XXX
          {
            guard: ({ context, event }) =>
              context.lastCalled !== null &&
              event.ev.timeStamp - context.lastCalled.timeStamp > 500,
            actions: [
              { type: 'call', params: ({ event: { ev } }) => ({ ev }) },
              assign({
                lastTicked: null,
                lastCalled: ({ event: { ev } }) => ev,
              }),
            ],
            target: 'Idle',
          },
          {
            actions: assign({
              lastTicked: ({ event }) => event.ev,
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
            {
              type: 'call',
              params: ({ context }) => ({ ev: context.lastTicked }),
            },
            assign({
              lastTicked: null,
              lastCalled: ({ context }) => context.lastTicked,
            }),
          ],
          target: 'Idle',
        },
      ],
    },
  },
})

const throttleActor = createActor(throttleMachine)

throttleActor.start()

throttleActor.on('CALL', ({ ev }) => {
  if (ev !== null) {
    const e: null | HTMLDivElement = document.querySelector('#longitude')
    if (e === null) {
      return
    }
    e.innerHTML = `E ${ev.timeStamp}`
  }
})

// XXX
// XXX
// XXX
function updateGeo(ev: EV): void {
  throttleActor.send({ type: 'TICK', ev })
}
// XXX
// XXX
// XXX

scrollCbs.add(updateGeo)
