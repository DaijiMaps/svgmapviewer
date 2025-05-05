import { useSelector } from '@xstate/store/react'
import { layers } from './lib/layers'

export function useLayers() {
  const context = useSelector(layers, (state) => state.context)

  return {
    context,
    toggleLabels: layers.trigger.toggleLabels,
    toggleSymbols: layers.trigger.toggleSymbols,
    toggleMarkers: layers.trigger.toggleMarkers,
  }
}

export function LayersStyle() {
  const layers = useLayers()

  const showLabels = layers.context.showLabels

  return (
    <style>
      {`
.poi-symbols,
.poi-stars,
.poi-names {
  display: ${showLabels ? 'initial' : 'none'};
}
      `}
    </style>
  )
}

export function LayersSvgStyle() {
  const layers = useLayers()

  const showSymbols = layers.context.showSymbols
  const showMarkers = layers.context.showMarkers

  return (
    <style>
      {`
.map-symbols {
  display: ${showSymbols ? 'initial' : 'none'};
}
.map-markers {
  display: ${showMarkers ? 'initial' : 'none'};
}
      `}
    </style>
  )
}

export function LayersButtons() {
  const layers = useLayers()

  return (
    <>
      <p className="layers">
        <span
          className="layer"
          // eslint-disable-next-line functional/no-return-void
          onClick={() => layers.toggleLabels()}
        >
          Labels
        </span>
        <span
          className="layer"
          // eslint-disable-next-line functional/no-return-void
          onClick={() => layers.toggleSymbols()}
        >
          Symbols
        </span>
        <span
          className="layer"
          // eslint-disable-next-line functional/no-return-void
          onClick={() => layers.toggleMarkers()}
        >
          Markers
        </span>
      </p>
      <style>
        {`
.layers {
  font-size: large;
  margin: 0.5em;
  display: flex;
}
.layer {
  padding: 0.5em;
  border: 1px solid black;
}
`}
      </style>
    </>
  )
}
