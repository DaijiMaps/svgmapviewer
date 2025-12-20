/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */

export type Cb = () => void
export type Cbs = Set<Cb>

export type Cb1<T> = (args: T) => void
export type Cbs1<T> = Set<Cb1<T>>

export function notifyCbs0(cbs: Readonly<Set<Cb>>): void {
  cbs.forEach((cb: Cb) => cb())
}
export function notifyCbs<T>(cbs: Readonly<Set<Cb1<T>>>, args: T): void {
  cbs.forEach((cb: Cb1<T>) => cb(args))
}
