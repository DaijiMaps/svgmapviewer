import { createStore } from '@xstate/store'

export const layers = createStore({
  context: {
    showLabels: true,
    showStars: true,
    showSymbols: true,
    showMarkers: true,
  },
  on: {
    toggleLabels: (context) => ({
      ...context,
      showLabels: !context.showLabels,
    }),
    toggleStars: (context) => ({
      ...context,
      showStars: !context.showStars,
    }),
    toggleSymbols: (context) => ({
      ...context,
      showSymbols: !context.showSymbols,
    }),
    toggleMarkers: (context) => ({
      ...context,
      showMarkers: !context.showMarkers,
    }),
  },
})
