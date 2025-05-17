import { useSelector } from '@xstate/react'
import clsx from 'clsx'
import { RenderMapProps } from './lib'
import { layers } from './lib/layers'
import { selectLayoutConfig, selectLayoutSvgScaleS, selectZoom } from './Map'

export function useLayers() {
  const context = useSelector(layers, (state) => state.context)

  return {
    context,
    toggleLabels: layers.trigger.toggleLabels,
    toggleStars: layers.trigger.toggleStars,
    toggleSymbols: layers.trigger.toggleSymbols,
    toggleMarkers: layers.trigger.toggleMarkers,
  }
}

export function LayersStyle() {
  const layers = useLayers()

  const showLabels = layers.context.showLabels
  const showStars = layers.context.showStars

  return (
    <style>
      {`
.poi-symbols,
.poi-names {
  display: ${showLabels ? 'initial' : 'none'};
}
.poi-stars {
  display: ${showStars ? 'initial' : 'none'};
}
      `}
    </style>
  )
}

export function LayersSvgStyle(props: Readonly<RenderMapProps>) {
  const { renderMapRef } = props

  const layers = useLayers()

  const showSymbols = layers.context.showSymbols
  const showMarkers = layers.context.showMarkers

  const config = useSelector(renderMapRef, selectLayoutConfig)
  const s = useSelector(renderMapRef, selectLayoutSvgScaleS)
  const zoom = useSelector(renderMapRef, selectZoom)
  const sz =
    config.fontSize *
    // display symbol slightly larger as zoom goes higher
    (0.5 + 0.5 * Math.log2(Math.max(1, zoom))) *
    s

  return (
    <style>
      {`
.map-symbols {
  display: ${showSymbols ? 'initial' : 'none'};
  --map-symbol-size: ${sz / 72};
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
          className={clsx(
            'layer',
            layers.context.showLabels ? 'shown' : 'hidden'
          )}
          // eslint-disable-next-line functional/no-return-void
          onClick={() => layers.toggleLabels()}
        >
          Labels
        </span>
        <span
          className={clsx(
            'layer',
            layers.context.showStars ? 'shown' : 'hidden'
          )}
          // eslint-disable-next-line functional/no-return-void
          onClick={() => layers.toggleStars()}
        >
          Stars
        </span>
        <span
          className={clsx(
            'layer',
            layers.context.showSymbols ? 'shown' : 'hidden'
          )}
          // eslint-disable-next-line functional/no-return-void
          onClick={() => layers.toggleSymbols()}
        >
          Symbols
        </span>
        {/*
        <span
          className={clsx(
            'layer',
            layers.context.showMarkers ? 'shown' : 'hidden'
          )}
          // eslint-disable-next-line functional/no-return-void
          onClick={() => layers.toggleMarkers()}
        >
          Markers
        </span>
        */}
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
.layer.hidden {
  opacity: 0.5;
}
`}
      </style>
    </>
  )
}
