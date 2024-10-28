# UI

- auto pilot
- auto play
- keyboard move with animation
  - acceralation by typing hjkl multiple times
  - stop by SPC key
  - cancel animation

# INTERNAL

- distinguish Matrix (record) and M (tuple)
  - tuple can use only `readonly'
  - clean up usages of Readonly/ReadonlyDeep
- Matrix -> CSSMatrix
  - type CSSMatrix = Matrix | Matrix[]
  - cssMatrixToString()
  - use `transform: matrix(...) matrix(...) ...' notation in CSS
- refactor style.ts
  - use class (e.g. .container.mode-panning)
  - use CSS var
  - move more to static CSS definition
- xstate: use only actor-ref (useActorRef)
  - use ref.subscribe()
  - don't use state (ref.getSnapshot())
