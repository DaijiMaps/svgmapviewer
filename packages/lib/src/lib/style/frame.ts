/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
type Name = string
type RequestID = number
type TickCb<D = unknown> = (progress: number, cbdata?: D) => void
type DoneCb<D = unknown> = (cbdata?: D) => void
type Options<D = unknown> = Readonly<{
  tickcb?: TickCb<D>
  donecb?: DoneCb<D>
  cbdata?: D
}>

const ids = new Map<Name, RequestID>()

export function startLoop<D = unknown>(
  name: string,
  duration: number,
  options?: Options<D>
): void {
  const started = performance.now()
  function loop(now: number): void {
    const delta = Math.abs(now - started)
    const progress = delta / duration
    options?.tickcb?.(progress, options?.cbdata)
    if (progress < 1) {
      const id = requestAnimationFrame(loop)
      ids.set(name, id)
    } else {
      const id = ids.get(name)
      if (id !== undefined) {
        cancelAnimationFrame(id)
      }
      ids.delete(name)
      options?.donecb?.(options?.cbdata)
    }
  }
  const id = requestAnimationFrame(loop)
  ids.set(name, id)
}
