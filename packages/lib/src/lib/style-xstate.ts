import { assign, createActor, setup, StateFrom } from 'xstate'
import { Animation } from './animation'
import { emptyLayout, Layout } from './layout'

export type StyleEvent =
  | { type: 'STYLE.LAYOUT'; layout: Layout; rendered: boolean }
  | { type: 'STYLE.DRAGGING'; dragging: boolean }
  | { type: 'STYLE.MODE'; mode: string }
  | { type: 'STYLE.ANIMATION'; animation: null | Animation } // null to stop animation
  | { type: 'ANIMATION.END' } // null to stop animation

interface StyleContext {
  rendered: boolean
  animating: boolean
  layout: Layout
  dragging: boolean
  mode: string
  animation: null | Animation
}

const styleMachine = setup({
  types: {
    events: {} as StyleEvent,
    context: {} as StyleContext,
  },
}).createMachine({
  id: 'style1',
  context: {
    rendered: true,
    animating: false,
    layout: emptyLayout,
    dragging: false,
    mode: 'pointing',
    animation: null,
  },
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        'STYLE.LAYOUT': {
          actions: assign({
            rendered: ({ event }) => event.rendered,
            animating: ({ context, event }) =>
              // if animating, don't change (animating is cleared only by 'ANIMATION.END')
              context.animating ||
              // if not animating, transition from !rendered to rendered triggers opacity animation
              (!context.rendered && event.rendered && !context.animating),
            layout: ({ event }) => event.layout,
          }),
        },
        'STYLE.DRAGGING': {
          actions: assign({
            dragging: ({ event }) => event.dragging,
          }),
        },
        'STYLE.MODE': {
          actions: assign({
            mode: ({ event }) => event.mode,
          }),
        },
        'STYLE.ANIMATION': {
          actions: assign({
            animation: ({ event }) => event.animation,
          }),
        },
        'ANIMATION.END': {
          actions: assign({
            animating: () => false,
          }),
        },
      },
    },
  },
})

export const styleActor = createActor(styleMachine, {
  systemId: 'system-pointer1',
})
styleActor.start()

export type StyleMachine = typeof styleMachine
export type StyleState = StateFrom<StyleMachine>

export function styleAnimationEnd() {
  styleActor.send({ type: 'ANIMATION.END' })
}
