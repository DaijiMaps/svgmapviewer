/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */

export type Cb = () => void | Promise<void>
export type Cbs = Set<Cb>

export type Cb1<T> = (args: T) => void | Promise<void>
export type Cbs1<T> = Set<Cb1<T>>

export function notifyCbs0(cbs: Readonly<ReadonlySet<Cb>>): void {
  Promise.all(cbs.values().map((cb) => Promise.resolve(cb()))).catch((e) =>
    console.log(`notifyCbs0`, e)
  )
}
export function notifyCbs<T>(
  cbs: Readonly<ReadonlySet<Cb1<T>>>,
  args: T
): void {
  Promise.all(cbs.values().map((cb) => Promise.resolve(cb(args)))).catch((e) =>
    console.log(`notifyCbs`, e)
  )
}
